export const dynamic = "force-dynamic"
import { getTestimonials } from '@/lib/actions'
import { TestimonialsClient } from '@/components/admin/TestimonialsClient'

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials(true)
  return <TestimonialsClient testimonials={testimonials} />
}
