'use server'

import { z } from 'zod'
import { supabase, supabaseAdmin } from './supabase'
import { requireAdmin } from './auth-guard'
import { revalidatePublicSite, revalidateAdminPaths } from './revalidate'

async function afterMutation() {
  await revalidatePublicSite()
  await revalidateAdminPaths()
}

// ─── Public reads ───────────────────────────────────────────

export async function getSiteSettings() {
  const { data } = await supabase.from('site_settings').select('*')
  if (!data) return {}
  return Object.fromEntries(data.map(s => [s.key, s.value]))
}

export async function getServices(adminMode = false) {
  let query = supabase.from('services').select('*').order('order_index')
  if (!adminMode) query = query.eq('is_visible', true).neq('category', 'Infrastructure')
  const { data } = await query
  return data || []
}

export async function getWorks(adminMode = false) {
  let query = supabase.from('works').select('*').order('order_index')
  if (!adminMode) query = query.eq('is_visible', true)
  const { data } = await query
  return data || []
}

export async function getTeamMembers(adminMode = false) {
  let query = supabase.from('team_members').select('*').order('order_index')
  if (!adminMode) query = query.eq('is_visible', true)
  const { data } = await query
  return data || []
}

const REMOVED_SERVICE_CATEGORIES = new Set(['Infrastructure'])

const DEFAULT_OPTIONS: Record<string, { value: string; label: string; order_index: number }[]> = {
  service_category: [
    { value: 'AI', label: 'AI', order_index: 0 },
    { value: 'Software', label: 'Software', order_index: 1 },
    { value: 'Automation', label: 'Automation', order_index: 2 },
  ],
  project_category: [
    { value: 'AI', label: 'AI', order_index: 0 },
    { value: 'Software', label: 'Software', order_index: 1 },
    { value: 'Automation', label: 'Automation', order_index: 2 },
    { value: 'Mobile', label: 'Mobile', order_index: 3 },
  ],
  service_icon: [
    { value: 'Brain', label: 'Brain', order_index: 0 },
    { value: 'Cpu', label: 'Cpu', order_index: 1 },
    { value: 'Globe', label: 'Globe', order_index: 2 },
    { value: 'Smartphone', label: 'Smartphone', order_index: 3 },
    { value: 'Zap', label: 'Zap', order_index: 4 },
    { value: 'Cloud', label: 'Cloud', order_index: 5 },
  ],
  contact_service_type: [
    { value: 'AI Solutions & Integration', label: 'AI Solutions & Integration', order_index: 0 },
    { value: 'Machine Learning Systems', label: 'Machine Learning Systems', order_index: 1 },
    { value: 'Web Application Development', label: 'Web Application Development', order_index: 2 },
    { value: 'Mobile App Development', label: 'Mobile App Development', order_index: 3 },
    { value: 'Intelligent Automation', label: 'Intelligent Automation', order_index: 4 },
    { value: 'Cloud & Deployment', label: 'Cloud & Deployment', order_index: 5 },
    { value: 'Other', label: 'Other', order_index: 6 },
  ],
}

export async function getCustomOptions(type?: string) {
  let query = supabase.from('custom_options').select('*').order('order_index')
  if (type) query = query.eq('option_type', type)
  const { data, error } = await query
  if (error || !data?.length) {
    if (type && DEFAULT_OPTIONS[type]) {
      return DEFAULT_OPTIONS[type].map((o, i) => ({
        id: `default-${type}-${i}`,
        option_type: type,
        ...o,
        created_at: new Date().toISOString(),
      }))
    }
    return []
  }

  if (type === 'service_category') {
    return data.filter(option => !REMOVED_SERVICE_CATEGORIES.has(option.value))
  }

  return data
}

export async function getSectionOrder(): Promise<string[]> {
  const settings = await getSiteSettings()
  const validSections = ['home', 'services', 'works', 'about', 'testimonials', 'contact']

  try {
    const parsed = JSON.parse(settings.section_order || '[]')
    if (Array.isArray(parsed) && parsed.length > 0) {
      const normalized = parsed
        .filter((id: string) => id !== 'stats' && validSections.includes(id))
        .reduce<string[]>((acc, id) => acc.includes(id) ? acc : [...acc, id], [])

      if (!normalized.includes('testimonials')) {
        const contactIndex = normalized.indexOf('contact')
        if (contactIndex !== -1) normalized.splice(contactIndex, 0, 'testimonials')
        else normalized.push('testimonials')
      }

      if (normalized.length > 0) return normalized
    }
  } catch {
    /* fallback */
  }

  return ['home', 'services', 'works', 'about', 'testimonials', 'contact']
}

// ─── Contact form (public) ───────────────────────────────────

const contactRequestSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  company: z.string().trim().max(100).optional().or(z.literal('')),
  service_type: z.string().trim().min(1, 'Service type is required'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(1000),
})

export async function submitContactForm(data: {
  name: string
  email: string
  phone?: string
  company?: string
  service_type: string
  message: string
}) {
  try {
    const parsedData = contactRequestSchema.parse(data)
    const { error } = await supabaseAdmin
      .from('contact_requests')
      .insert({ ...parsedData, status: 'new' })

    if (error) {
      console.error('DATABASE ERROR during submitContactForm:', error)
      throw new Error(error.message)
    }
    await afterMutation()
    return { success: true }
  } catch (err) {
    console.error('ERROR in submitContactForm Server Action:', err)
    throw err
  }
}

// ─── Analytics (public track + admin read) ───────────────────

export async function trackPageView(path: string, referrer?: string, userAgent?: string) {
  try {
    await supabaseAdmin.from('site_analytics').insert({
      event_type: 'page_view',
      path,
      referrer: referrer || null,
      user_agent: userAgent || null,
    })
  } catch { /* analytics table may not exist yet */ }
}

export async function getAnalytics() {
  await requireAdmin()
  const { data } = await supabaseAdmin
    .from('site_analytics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5000)

  const events = data || []
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 86400000)
  const monthAgo = new Date(today.getTime() - 30 * 86400000)

  const pageViews = events.filter(e => e.event_type === 'page_view')
  const todayViews = pageViews.filter(e => new Date(e.created_at) >= today).length
  const weekViews = pageViews.filter(e => new Date(e.created_at) >= weekAgo).length
  const monthViews = pageViews.filter(e => new Date(e.created_at) >= monthAgo).length
  const totalViews = pageViews.length

  const pathCounts: Record<string, number> = {}
  pageViews.forEach(e => { pathCounts[e.path] = (pathCounts[e.path] || 0) + 1 })
  const topPages = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }))

  // Daily views last 7 days
  const dailyViews: { date: string; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000)
    const next = new Date(d.getTime() + 86400000)
    const count = pageViews.filter(e => {
      const t = new Date(e.created_at)
      return t >= d && t < next
    }).length
    dailyViews.push({ date: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }), count })
  }

  return { todayViews, weekViews, monthViews, totalViews, topPages, dailyViews }
}

// ─── File upload ─────────────────────────────────────────────

export async function uploadImage(formData: FormData, folder: string) {
  await requireAdmin()
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) throw new Error('No file provided')
  if (file.size > 5 * 1024 * 1024) throw new Error('File must be under 5MB')

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  if (!allowed.includes(ext)) throw new Error('Only JPG, PNG, WebP, GIF allowed')

  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabaseAdmin.storage
    .from('uploads')
    .upload(fileName, buffer, { contentType: file.type, upsert: true })

  if (error) throw new Error(error.message)

  const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(fileName)
  await afterMutation()
  return { url: urlData.publicUrl }
}

// ─── Admin: contacts ─────────────────────────────────────────

export async function getContactRequests() {
  await requireAdmin()
  const { data } = await supabaseAdmin
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function updateContactStatus(id: string, status: 'new' | 'read' | 'replied') {
  await requireAdmin()
  await supabaseAdmin.from('contact_requests').update({ status }).eq('id', id)
  await afterMutation()
}

export async function deleteContact(id: string) {
  await requireAdmin()
  await supabaseAdmin.from('contact_requests').delete().eq('id', id)
  await afterMutation()
}

// ─── Admin: visibility & delete ────────────────────────────────

export async function toggleVisibility(table: string, id: string, current: boolean) {
  await requireAdmin()
  await supabaseAdmin.from(table).update({ is_visible: !current }).eq('id', id)
  await afterMutation()
}

export async function deleteItem(table: string, id: string) {
  await requireAdmin()
  await supabaseAdmin.from(table).delete().eq('id', id)
  await afterMutation()
}

// ─── Admin: reorder (drag & drop) ────────────────────────────

export async function reorderItems(table: string, orderedIds: string[]) {
  await requireAdmin()
  await Promise.all(
    orderedIds.map((id, index) =>
      supabaseAdmin.from(table).update({ order_index: index }).eq('id', id)
    )
  )
  await afterMutation()
}

export async function updateSectionOrder(orderedSections: string[]) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('site_settings').upsert({
    key: 'section_order',
    value: JSON.stringify(orderedSections),
  }, { onConflict: 'key' })
  if (error) throw new Error(error.message)
  await afterMutation()
}

// ─── Admin: CRUD ─────────────────────────────────────────────

export async function upsertService(data: Record<string, unknown>) {
  await requireAdmin()
  if (data.id) {
    const { id, ...rest } = data
    await supabaseAdmin.from('services').update(rest).eq('id', id)
  } else {
    const { data: max } = await supabaseAdmin.from('services').select('order_index').order('order_index', { ascending: false }).limit(1)
    const order_index = (max?.[0]?.order_index ?? -1) + 1
    await supabaseAdmin.from('services').insert({ ...data, order_index })
  }
  await afterMutation()
}

export async function upsertWork(data: Record<string, unknown>) {
  await requireAdmin()
  const cleanData = { ...data }
  delete cleanData.github_url
  if (cleanData.id) {
    const { id, ...rest } = cleanData
    await supabaseAdmin.from('works').update(rest).eq('id', id)
  } else {
    const { data: max } = await supabaseAdmin.from('works').select('order_index').order('order_index', { ascending: false }).limit(1)
    const order_index = (max?.[0]?.order_index ?? -1) + 1
    await supabaseAdmin.from('works').insert({ ...cleanData, order_index })
  }
  await afterMutation()
}

export async function upsertTeamMember(data: Record<string, unknown>) {
  await requireAdmin()
  const payload: Record<string, unknown> = { ...data }
  if (!payload.role) {
    payload.role = 'Pro'
  }
  if (payload.id) {
    const { id, ...rest } = payload
    await supabaseAdmin.from('team_members').update(rest).eq('id', id as string)
  } else {
    const { data: max } = await supabaseAdmin.from('team_members').select('order_index').order('order_index', { ascending: false }).limit(1)
    const order_index = (max?.[0]?.order_index ?? -1) + 1
    await supabaseAdmin.from('team_members').insert({ ...payload, order_index })
  }
  await afterMutation()
}

export async function updateSetting(key: string, value: string) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
  if (error) throw new Error(error.message)
  await afterMutation()
}

export async function updateSettingsBatch(settings: Record<string, string>) {
  await requireAdmin()
  await Promise.all(
    Object.entries(settings).map(async ([key, value]) => {
      const { error } = await supabaseAdmin.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
      if (error) throw new Error(error.message)
    })
  )
  await afterMutation()
}

// ─── Admin: custom options ───────────────────────────────────

export async function addCustomOption(optionType: string, value: string, label: string) {
  await requireAdmin()
  const { data: max } = await supabaseAdmin.from('custom_options').select('order_index').eq('option_type', optionType).order('order_index', { ascending: false }).limit(1)
  const order_index = (max?.[0]?.order_index ?? -1) + 1
  const { error } = await supabaseAdmin.from('custom_options').insert({ option_type: optionType, value, label, order_index })
  if (error) throw new Error(error.message)
  await afterMutation()
}

export async function deleteCustomOption(id: string) {
  await requireAdmin()
  await supabaseAdmin.from('custom_options').delete().eq('id', id)
  await afterMutation()
}

// ─── Dashboard stats ─────────────────────────────────────────

export async function getDashboardStats() {
  await requireAdmin()
  const [services, works, team, contacts, analytics] = await Promise.all([
    supabaseAdmin.from('services').select('id', { count: 'exact' }),
    supabaseAdmin.from('works').select('id', { count: 'exact' }),
    supabaseAdmin.from('team_members').select('id', { count: 'exact' }),
    supabaseAdmin.from('contact_requests').select('id, status', { count: 'exact' }),
    supabaseAdmin.from('site_analytics').select('id', { count: 'exact' }),
  ])

  const newContacts = contacts.data?.filter(c => c.status === 'new').length || 0

  return {
    totalServices: services.count || 0,
    totalWorks: works.count || 0,
    totalTeam: team.count || 0,
    totalContacts: contacts.count || 0,
    newContacts,
    totalViews: analytics.count || 0,
  }
}

// ─── Testimonials CRUD ───────────────────────────────────────

const MOCK_TESTIMONIALS = [
  { id: 'mock-1', name: 'Arun Kumar', company: 'CEO, TechVantage', city: 'Chennai', rating: 5, content: "Precision Pro's delivered our AI customer support agent on schedule. It has cut our support queue by 60% and resolved customer inquiries instantly. Highly professional team!", is_visible: true, order_index: 0 },
  { id: 'mock-2', name: 'Priya Sharma', company: 'Product Manager, Innovate Corp', city: 'Bangalore', rating: 5, content: 'Their software engineering team is exceptional. The full-stack app they built for us is highly scalable, fast, and exactly what we envisioned. Would definitely recommend them.', is_visible: true, order_index: 1 },
  { id: 'mock-3', name: 'Sanjay Viswanathan', company: 'Operations Director, LogiChain', city: 'Hyderabad', rating: 5, content: 'The automation workflows they designed for our operations have saved us countless hours of manual work. The integration was seamless, and the results speak for themselves.', is_visible: true, order_index: 2 }
]

export async function getTestimonials(adminMode = false) {
  try {
    let query = supabase.from('testimonials').select('*').order('order_index')
    if (!adminMode) query = query.eq('is_visible', true)
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn("Failed to fetch testimonials from database, using fallback:", err)
    return MOCK_TESTIMONIALS
  }
}

export async function upsertTestimonial(data: Record<string, unknown>) {
  await requireAdmin()
  if (data.id && typeof data.id === 'string' && !data.id.startsWith('mock-')) {
    const { id, ...rest } = data
    await supabaseAdmin.from('testimonials').update(rest).eq('id', id)
  } else {
    const cleanData = { ...data }
    if (cleanData.id && typeof cleanData.id === 'string' && cleanData.id.startsWith('mock-')) {
      delete cleanData.id
    }
    const { data: max } = await supabaseAdmin.from('testimonials').select('order_index').order('order_index', { ascending: false }).limit(1)
    const order_index = (max?.[0]?.order_index ?? -1) + 1
    await supabaseAdmin.from('testimonials').insert({ ...cleanData, order_index })
  }
  await afterMutation()
}

export async function deleteTestimonial(id: string) {
  await requireAdmin()
  if (!id.startsWith('mock-')) {
    await supabaseAdmin.from('testimonials').delete().eq('id', id)
  }
  await afterMutation()
}
