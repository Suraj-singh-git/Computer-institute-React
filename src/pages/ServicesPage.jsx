import CallToAction from '../components/CallToAction'
import PageMeta from '../components/PageMeta'
import SectionHeading from '../components/SectionHeading'
import ServiceIcon from '../components/ServiceIcon'
import TypeText from '../components/TypeText'
import { faqs, processSteps, services } from '../data/siteContent'

function ServicesPage() {
  return (
    <main className="pb-10">
      <PageMeta
        title="Website Design, Laravel Development and API Integration Services | S&D Developers"
        description="Explore the website design, landing page, Laravel development, booking system, payment integration, and API services offered by Suraj Singh through S&D Developers."
        pageType="CollectionPage"
      />

      <section className="mx-auto max-w-7xl px-2 pt-8 sm:px-3 md:px-6 md:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="glass-panel rounded-[2.4rem] p-6 sm:p-8 md:p-10">
            <SectionHeading
              badge="Services"
              title="Website design and development services focused on practical business results."
              text="I work on service business websites, landing pages, Laravel platforms, admin panels, APIs, payment gateways, booking systems, and connected business features."
              theme="dark"
              titleAs="h1"
            />
          </div>

          <div className="soft-panel overflow-hidden rounded-[2.4rem] p-3">
            <div className="relative overflow-hidden rounded-[1.8rem]">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                alt="Digital product design and analytics workspace"
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 rounded-[1.25rem] bg-black/80 p-3 text-white backdrop-blur sm:inset-x-6 sm:bottom-6 sm:rounded-[1.6rem] sm:p-5">
                <TypeText
                  as="p"
                  text="Modern delivery stack"
                  className="text-xs font-bold uppercase tracking-[0.26em] text-yellow-200"
                  speed={20}
                />
                <TypeText
                  as="p"
                  text="Responsive websites, backend workflows, payment setup, and business-focused development delivered in one connected process."
                  className="mt-2 text-base leading-7 text-yellow-50/82 sm:mt-3 sm:text-xl sm:leading-8"
                  speed={8}
                  caret={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-2 sm:px-3 md:mt-24 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service, index) => (
            <article
              key={service.title}
              className={`rounded-[2.2rem] p-6 sm:p-8 ${
                index % 2 === 0 ? 'soft-panel text-slate-950' : 'glass-panel text-yellow-50'
              }`}
            >
              <ServiceIcon type={service.icon} />
              <h3 className="mt-5 font-display text-[2rem] font-bold sm:mt-6 sm:text-3xl">
                {service.title}
              </h3>
              <p
                className={`mt-4 text-base leading-7 sm:text-lg sm:leading-8 ${
                  index % 2 === 0 ? 'text-slate-800' : 'text-yellow-100/75'
                }`}
              >
                {service.text}
              </p>
              <ul
                className={`mt-6 space-y-3 text-base leading-7 ${
                  index % 2 === 0 ? 'text-slate-800' : 'text-yellow-100/75'
                }`}
              >
                {service.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-2 sm:px-3 md:mt-24 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="glass-panel rounded-[2.3rem] p-6 sm:p-8 md:p-10">
            <SectionHeading
              badge="Process"
              title="A clear process helps every website stay cleaner, faster, and easier to manage."
              text="From planning to delivery, I keep the work structured so the final website is easier for visitors to use and easier for the business to grow."
              theme="dark"
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                className="soft-panel rounded-[2rem] p-5 sm:p-6 text-slate-950"
              >
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                  Step {index + 1}
                </p>
                <h3 className="mt-4 font-display text-[2rem] font-bold sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-700">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-2 sm:px-3 md:mt-24 md:px-6">
        <div className="glass-panel rounded-[2.4rem] p-6 sm:p-8 md:p-10">
          <SectionHeading
            badge="FAQ"
            title="Common questions before starting a website or development project"
            text="These answers explain the kind of work I handle, how I approach SEO-ready structure, and whether I can manage both design and backend development."
            theme="dark"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-[1.7rem] border border-yellow-300/16 bg-yellow-300/7 p-6"
              >
                <h3 className="text-xl font-bold text-yellow-100 sm:text-2xl">{faq.question}</h3>
                <p className="mt-4 text-base leading-7 text-yellow-100/75 sm:text-lg sm:leading-8">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CallToAction
        badge="Need the right build?"
        title="Tell me what your website or backend needs to do, and I will shape the right solution."
        text="Whether you need a responsive business website, Laravel backend support, API integration, booking features, or a redesign of your current site, I can help you define and build it."
        primaryLabel="Discuss Your Project"
        primaryTo="/contact"
        secondaryLabel="See My Work"
        secondaryTo="/work"
      />
    </main>
  )
}

export default ServicesPage
