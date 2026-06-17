export interface Service {
  id: string
  title: string
  description: string
  icon: string
  category?: string
  features: string[]
  is_visible: boolean
  order_index?: number
  created_at?: string
  updated_at?: string
}

export interface Work {
  id: string
  title: string
  description: string
  tags: string[]
  category: string
  is_featured: boolean
  is_visible: boolean
  client_name: string | null
  project_url: string | null
  github_url?: string | null
  image_url: string | null
  order_index?: number
  created_at?: string
  updated_at?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  designation: string
  photo_url: string | null
  linkedin_url?: string | null
  instagram_url?: string | null
  is_visible: boolean
  order_index?: number
  created_at?: string
  updated_at?: string
}

export interface Testimonial {
  id: string
  name: string
  company: string | null
  city: string | null
  rating: number
  content: string
  is_visible: boolean
  order_index?: number
  created_at?: string
  updated_at?: string
}

export interface ContactRequest {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  service_type: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at?: string
  updated_at?: string
}

export interface CustomOption {
  id: string
  option_type: string
  value: string
  label: string
  order_index?: number
  created_at?: string
}

export interface SiteSettings {
  [key: string]: string
}

export interface AnalyticsStats {
  todayViews: number
  weekViews: number
  monthViews: number
  totalViews: number
  topPages: { path: string; count: number }[]
  dailyViews: { date: string; count: number }[]
}
