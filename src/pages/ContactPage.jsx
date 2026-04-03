import emailjs from '@emailjs/browser'
import { useRef, useState } from 'react'
import PageMeta from '../components/PageMeta'
import ProfilePhoto from '../components/ProfilePhoto'
import SectionHeading from '../components/SectionHeading'
import TypeText from '../components/TypeText'
import { contactMethods } from '../data/siteContent'
import { emailjsConfig, hasEmailJsConfig, buildWhatsAppHref } from '../utils/contact'

const initialForm = {
  from_name: '',
  reply_to: '',
  business_type: '',
  budget: 'Under Rs. 25,000',
  project_details: '',
}

function ContactCard({ method }) {
  const content = (
    <>
      <TypeText
        as="p"
        text={method.title}
        className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-200"
        speed={20}
      />
      <TypeText
        as="p"
        text={method.text}
        className="mt-2 text-lg font-semibold leading-7 text-yellow-100"
        speed={9}
        caret={false}
      />
    </>
  )

  if (method.href === '#') {
    return (
      <div className="rounded-[1.5rem] border border-yellow-300/16 bg-yellow-300/7 p-5">
        {content}
      </div>
    )
  }

  return (
    <a
      href={method.href}
      target={method.external ? '_blank' : undefined}
      rel={method.external ? 'noreferrer' : undefined}
      className="rounded-[1.5rem] border border-yellow-300/16 bg-yellow-300/7 p-5 transition hover:bg-yellow-300/12"
    >
      {content}
    </a>
  )
}

function ContactPage() {
  const formRef = useRef(null)
  const [form, setForm] = useState(initialForm)
  const [isSending, setIsSending] = useState(false)
  const [notice, setNotice] = useState({ type: '', message: '' })

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    if (notice.message) {
      setNotice({ type: '', message: '' })
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!hasEmailJsConfig) {
      setNotice({
        type: 'error',
        message:
          'Email sending is added, but EmailJS keys are still missing. Add your EmailJS values in .env.local to activate automatic email delivery.',
      })

      return
    }

    setIsSending(true)
    setNotice({ type: '', message: '' })

    try {
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        {
          publicKey: emailjsConfig.publicKey,
        },
      )

      setNotice({
        type: 'success',
        message:
          'Your enquiry has been sent successfully. Suraj Singh will receive your requirement by email.',
      })
      setForm(initialForm)
    } catch {
      setNotice({
        type: 'error',
        message:
          'The enquiry could not be sent right now. Please try again or message directly on WhatsApp.',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="pb-10">
      <PageMeta
        title="Contact S&D Developers | Website Enquiry and Project Discussion"
        description="Contact Suraj Singh for business website design, landing pages, Laravel development, booking systems, API integration, payment gateway setup, and website redesign work."
        pageType="ContactPage"
      />

      <section className="mx-auto max-w-7xl px-2 pt-8 sm:px-3 md:px-6 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="glass-panel rounded-[2.4rem] p-6 sm:p-8 md:p-10">
            <SectionHeading
              badge="Contact"
              title="Let us discuss your website, redesign, or development requirement."
              text="If you need a business website, landing page, Laravel backend work, payment integration, booking flow, or custom API development, you can contact me directly here."
              theme="dark"
              titleAs="h1"
            />

            <div className="mt-8 grid gap-4">
              {contactMethods.map((method) => (
                <ContactCard key={method.title} method={method} />
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-[2rem]">
              <ProfilePhoto
                alt="Suraj Singh portrait"
                className="h-[280px] w-full object-cover sm:h-[320px]"
                objectPosition="center 18%"
              />
            </div>
          </div>

          <div className="soft-panel rounded-[2.4rem] p-6 sm:p-8 text-slate-950 md:p-10">
            <TypeText
              as="h2"
              text="Start your enquiry"
              className="font-display text-[2.1rem] leading-tight tracking-tight text-black sm:text-4xl md:text-5xl"
              speed={18}
            />
            <TypeText
              as="p"
              text="Share your business type, website requirement, target features, and budget range. I can then understand whether you need a landing page, business website, Laravel development, or a larger custom build."
              className="mt-4 max-w-2xl text-base leading-7 text-slate-800 sm:text-xl sm:leading-8"
              speed={8}
              caret={false}
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={buildWhatsAppHref('Hi Suraj, I want to discuss a website project.')}
                target="_blank"
                rel="noreferrer"
                className="btn-dark w-full sm:w-auto"
              >
                Chat on WhatsApp
              </a>
              <a
                href="mailto:surajsingh20796@gmail.com"
                className="btn-secondary w-full sm:w-auto"
              >
                Email Directly
              </a>
            </div>

            {notice.message ? (
              <div
                className={`mt-6 rounded-[1.5rem] border px-5 py-4 text-base font-semibold leading-7 ${
                  notice.type === 'success'
                    ? 'border-green-700/20 bg-green-950/10 text-green-900'
                    : 'border-red-900/10 bg-red-950/10 text-red-900'
                }`}
              >
                {notice.message}
              </div>
            ) : null}

            <form
              ref={formRef}
              className="mt-10 grid gap-5 md:grid-cols-2"
              onSubmit={handleSubmit}
            >
              <input
                type="hidden"
                name="submitted_at"
                value={new Date().toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
                readOnly
              />

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  Full name
                </span>
                <input
                  type="text"
                  name="from_name"
                  value={form.from_name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  className="w-full rounded-2xl border border-black/10 bg-yellow-50 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  Email
                </span>
                <input
                  type="email"
                  name="reply_to"
                  value={form.reply_to}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-black/10 bg-yellow-50 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  Business type
                </span>
                <input
                  type="text"
                  name="business_type"
                  value={form.business_type}
                  onChange={handleChange}
                  placeholder="Company, startup, service business..."
                  required
                  className="w-full rounded-2xl border border-black/10 bg-yellow-50 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  Budget range
                </span>
                <select
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-black/10 bg-yellow-50 px-4 py-3 outline-none transition focus:border-black"
                >
                  <option>Under Rs. 25,000</option>
                  <option>Rs. 25,000 - 50,000</option>
                  <option>Rs. 50,000 - 1,00,000</option>
                  <option>Above Rs. 1,00,000</option>
                </select>
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  Project details
                </span>
                <textarea
                  rows="6"
                  name="project_details"
                  value={form.project_details}
                  onChange={handleChange}
                  placeholder="Tell me about the pages, design style, backend features, integrations, timeline, or business goal."
                  required
                  className="w-full rounded-[1.6rem] border border-black/10 bg-yellow-50 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>

              <button
                type="submit"
                disabled={isSending}
                className="btn-dark md:col-span-2 md:w-fit"
              >
                {isSending ? 'Sending Enquiry...' : 'Send Enquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactPage
