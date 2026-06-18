'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, MessageCircle, Send, Loader2, CheckCircle2 } from "lucide-react"
import { Linkedin, Instagram, Youtube } from '@/components/ui/SocialIcons'
import { submitContactForm } from '@/lib/actions'
import { Confetti, ConfettiRef } from '@/components/ui/Confetti'

interface ContactPageProps {
  settings?: Record<string, string>
  serviceTypes?: string[]
}

function cleanPhone(num: string) {
  return num.replace(/[^\d+]/g, '')
}

function whatsappLink(num: string) {
  const clean = cleanPhone(num)
  const digits = clean.startsWith('+') ? clean.slice(1) : clean
  return `https://wa.me/${digits}`
}

export function ContactPage({ settings, serviceTypes = [] }: ContactPageProps) {
  const ref = useRef(null)
  const confettiRef = useRef<ConfettiRef>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service_type: '', message: '' })

  const email = settings?.email || 'hello@precisionpros.in'
  const phone = settings?.phone || '+91 98765 43210'
  const phone2 = settings?.phone_2 || '+91 98765 43211'
  const whatsapp = settings?.whatsapp || phone
  const instagram = settings?.instagram || 'https://instagram.com/precisionpros'
  const linkedin = settings?.linkedin || 'https://linkedin.com/company/precisionpros'
  const youtube = settings?.youtube || 'https://youtube.com/@precisionpros'

  const defaultTypes = [
    'AI Solutions & Integration', 'Machine Learning Systems',
    'Web Application Development', 'Mobile App Development',
    'Intelligent Automation', 'Cloud & Deployment', 'Other',
  ]
  const types = serviceTypes.length > 0 ? serviceTypes : defaultTypes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (submitted) setSubmitted(false)
    if (errorMsg) setErrorMsg(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.service_type || !form.message) {
      setErrorMsg('Please fill all required fields.')
      return
    }
    setLoading(true)
    setErrorMsg(null)
    try {
      await submitContactForm(form)
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', company: '', service_type: '', message: '' })
      confettiRef.current?.trigger()
    } catch {
      setErrorMsg('Failed to send. Please try WhatsApp or email directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-padding relative overflow-hidden">
      <Confetti ref={confettiRef} />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes glitter-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glitter-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glitter-hover-card {
          position: relative !important;
          overflow: hidden !important;
          isolation: isolate;
        }
        .glitter-hover-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, 
            rgba(227, 200, 168, 0.15), 
            rgba(93, 193, 164, 0.12), 
            rgba(171, 87, 255, 0.12), 
            rgba(152, 168, 162, 0.12), 
            rgba(227, 200, 168, 0.15)
          );
          background-size: 300% 300%;
          z-index: -2;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .glitter-hover-card:hover::before {
          opacity: 1;
          animation: glitter-bg 6s ease infinite;
        }
        .glitter-hover-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, 
            #e3c8a8, 
            #5dc1a4, 
            #ab57ff, 
            #98a8a2, 
            #e3c8a8
          );
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .glitter-hover-card:hover::after {
          opacity: 1;
          animation: glitter-border 3s linear infinite;
        }
      ` }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 sm:mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs text-primary tracking-widest uppercase">Contact</span>
          </div>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-6xl leading-tight mb-4 sm:mb-6 text-heading">
            Let&apos;s Build Something<br />
            <span className="italic text-premium-shimmer font-bold">Extraordinary</span>
          </h2>
          <p className="font-body text-base sm:text-lg text-body max-w-xl">Ready to turn your vision into reality? Reach out to start our collaboration.</p>
        </motion.div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <div className="space-y-4 mb-12">
              {/* WhatsApp Card */}
              <a
                href={whatsappLink(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="glitter-hover-card flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="p-3.5 rounded-xl bg-card border border-border/30 text-emerald-600 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-body tracking-widest uppercase mb-0.5">WhatsApp</p>
                  <p className="font-body text-sm font-bold text-heading group-hover:text-emerald-400 transition-colors duration-300 break-all">{whatsapp}</p>
                </div>
                <span className="ml-auto text-muted-foreground/40 group-hover:text-emerald-500 transition-colors text-lg shrink-0">→</span>
              </a>

              {/* Phone 1 Card */}
              <a
                href={`tel:${cleanPhone(phone)}`}
                className="glitter-hover-card flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="p-3.5 rounded-xl bg-card border border-border/30 text-blue-600 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <Phone size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-body tracking-widest uppercase mb-0.5">Phone 1</p>
                  <p className="font-body text-sm font-bold text-heading group-hover:text-blue-400 transition-colors duration-300 break-all">{phone}</p>
                </div>
                <span className="ml-auto text-muted-foreground/40 group-hover:text-blue-500 transition-colors text-lg shrink-0">→</span>
              </a>

              {/* Phone 2 Card */}
              {phone2 && (
                <a
                  href={`tel:${cleanPhone(phone2)}`}
                  className="glitter-hover-card flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="p-3.5 rounded-xl bg-card border border-border/30 text-blue-600 group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-body tracking-widest uppercase mb-0.5">Phone 2</p>
                    <p className="font-body text-sm font-bold text-heading group-hover:text-blue-400 transition-colors duration-300 break-all">{phone2}</p>
                  </div>
                  <span className="ml-auto text-muted-foreground/40 group-hover:text-blue-500 transition-colors text-lg shrink-0">→</span>
                </a>
              )}

              {/* Email Card */}
              <a
                href={`mailto:${email}`}
                className="glitter-hover-card flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="p-3.5 rounded-xl bg-card border border-border/30 text-primary group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <Mail size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] text-body tracking-widest uppercase mb-0.5">Email Address</p>
                  <p
                    className="font-body font-bold text-heading group-hover:text-primary transition-colors duration-300 whitespace-nowrap truncate"
                    style={{ fontSize: 'clamp(9px, 3.1vw, 14px)' }}
                  >
                    {email}
                  </p>
                </div>
                <span className="ml-auto text-muted-foreground/40 group-hover:text-primary transition-colors text-lg shrink-0">→</span>
              </a>
            </div>

            <div>
              <p className="font-mono text-xs text-body tracking-widest uppercase mb-5">Follow Our Journey</p>
              <div className="flex items-center gap-1.5 sm:gap-3 overflow-hidden">
                {[
                  { icon: Instagram, href: instagram, label: 'Instagram' },
                  { icon: Linkedin, href: linkedin, label: 'LinkedIn' },
                  { icon: Youtube, href: youtube, label: 'YouTube' },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-border/50 bg-card/60 hover:border-primary/30 hover:bg-primary/5 text-body hover:text-primary transition-all text-[11px] sm:text-xs md:text-sm font-medium whitespace-nowrap flex-1 text-center">
                    <Icon size={16} className="shrink-0" /> {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/50 bg-card/60 backdrop-blur-md">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full Name *" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} />
                <Field label="Email *" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                <Field label="Company" name="company" type="text" placeholder="Your company (optional)" value={form.company} onChange={handleChange} />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-body tracking-widest uppercase mb-2 font-semibold">Service Required *</label>
                <select name="service_type" value={form.service_type} onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-border bg-card text-heading font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="" style={{ backgroundColor: '#0c0717', color: '#f5efe6' }}>Select a service</option>
                  {types.map(s => (
                    <option key={s} value={s} style={{ backgroundColor: '#0c0717', color: '#f5efe6' }}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[11px] text-body tracking-widest uppercase mb-2 font-semibold">Project Details *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                  placeholder="Describe your project, goals, timeline, and requirements..."
                  className="w-full px-4 py-3.5 rounded-xl border border-border bg-card text-heading font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                <p className="text-[10px] text-[#a09888]/60 mt-1 font-mono">Minimum 10 characters required.</p>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#e3c8a8] via-[#5dc1a4] to-[#ab57ff] text-[#05020c] font-bold rounded-2xl hover:shadow-xl hover:shadow-primary/25 disabled:opacity-60 transition-all">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
              </button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 justify-center text-center p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 mt-3"
                >
                  <CheckCircle2 size={16} className="text-emerald-500 animate-pulse" />
                  <p className="font-body text-xs text-emerald-400 font-medium">
                    Thank you! Your message has been sent. We will contact you within 24 hours.
                  </p>
                </motion.div>
              )}

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 justify-center text-center p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/5 mt-3"
                >
                  <span className="text-rose-500 font-bold text-xs">⚠️</span>
                  <p className="font-body text-xs text-rose-400 font-medium">
                    {errorMsg}
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, name, type, placeholder, value, onChange }: {
  label: string; name: string; type: string; placeholder: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] text-body tracking-widest uppercase mb-2 font-semibold">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-xl border border-border bg-card text-heading font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  )
}
