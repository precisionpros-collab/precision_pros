export const dynamic = "force-dynamic"
import { getContactRequests, getSiteSettings } from '@/lib/actions'
import { ContactsClient } from '@/components/admin/ContactsClient'

export default async function ContactsPage() {
  const [contacts, settings] = await Promise.all([getContactRequests(), getSiteSettings()])
  return <ContactsClient contacts={contacts} senderEmail={settings.email || 'precisionprosbusiness@gmail.com'} />
}
