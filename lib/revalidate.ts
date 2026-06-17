'use server'

import { revalidatePath } from 'next/cache'

/** Revalidate all public pages so admin changes appear immediately */
export async function revalidatePublicSite() {
  revalidatePath('/', 'layout')
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/services')
  revalidatePath('/works')
  revalidatePath('/contact')
  revalidatePath('/team')
}

export async function revalidateAdminPaths() {
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/dashboard/projects')
  revalidatePath('/admin/dashboard/team')
  revalidatePath('/admin/dashboard/services')
  revalidatePath('/admin/dashboard/contacts')
  revalidatePath('/admin/dashboard/settings')
  revalidatePath('/admin/dashboard/analytics')
  revalidatePath('/admin/dashboard/options')
}
