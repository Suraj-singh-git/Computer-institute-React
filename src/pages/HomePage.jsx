import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import HeroSlider from '../components/HeroSlider'
import PageMeta from '../components/PageMeta'
import SectionHeading from '../components/SectionHeading'
import {
  clientShowcase,
  contactMethods,
  experienceBenefits,
  heroSlides,
  launchSteps,
  pricingPlans,
  projects,
  showcaseServices,
  stats,
} from '../data/siteContent'

const benefitIcons = [
  (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 4h10v16H7z" />
      <path d="M10 7h4" />
      <path d="M10 17h4" />
      <path d="M4 8h3M17 16h3" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="5" width="18" height="11" rx="2" />
      <path d="M9 19h6M12 16v3" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 18V8" />
      <path d="M10 18V12" />
      <path d="M15 18V6" />
      <path d="M20 18V10" />
      <path d="M4 4h16" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 18 10 6l4 8 6-10" />
      <path d="M4 20h16" />
    </svg>
  ),
]

function getProjectDomain(url) {
  if (!url) {
    return 'Private client project'
  }

  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

function HomePage() {
  const phoneMethod =
    contactMethods.find((item) => item.title === 'Phone')?.href ?? '/contact'

  return (
    <main className="pb-10">
      <PageMeta
        title="Website Design and Laravel Development | S&D Developers"
        description="S&D Developers is the portfolio website of Suraj Singh, offering responsive business websites, Laravel development, landing pages, booking systems, API integration, and SEO-ready website structure."
        pageType="WebPage"
      />

      <HeroSlider slides={heroSlides} stats={stats} />

      <section id="services" className="w-full px-2 pt-16 sm:px-3 sm:pt-20 md:px-5 md:pt-24 xl:px-6">
        <SectionHeading
          badge="Our Services"
          title="Website design and development services built around real business requirements."
          text="This homepage now presents your actual service areas clearly: business website design, landing pages, Laravel development, booking systems, integrations, and post-launch support."
          align="center"
          theme="dark"
        />

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
          {showcaseServices.map((service, index) => (
            <article
              key={service.title}
              className={`overflow-hidden rounded-[2.2rem] ${
                index % 2 === 0 ? 'soft-panel text-slate-950' : 'glass-panel text-white'
              }`}
            >
              <img
                src={service.image}
                alt={service.title}
                className="h-48 w-full object-cover sm:h-56"
              />
              <div className="p-6">
                <h3 className="font-display text-3xl font-bold sm:text-4xl">{service.title}</h3>
                <p
                  className={`mt-4 text-base leading-7 ${
                    index % 2 === 0 ? 'text-slate-800' : 'text-yellow-100/74'
                  }`}
                >
                  {service.text}
                </p>
                <a
                  href="#plans"
                  className={`mt-6 inline-flex w-full sm:w-auto ${
                    index % 2 === 0 ? 'btn-dark' : 'btn-secondary'
                  }`}
                >
                  Explore Plans
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full px-2 pt-16 sm:px-3 sm:pt-20 md:px-5 xl:px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {experienceBenefits.map((benefit, index) => (
            <article
              key={benefit.title}
              className="glass-panel flex rounded-[2rem] p-6 text-white"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/18 bg-yellow-300/8 text-yellow-200">
                  {benefitIcons[index]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-100">{benefit.title}</h3>
                  <p className="mt-3 text-base leading-7 text-yellow-50/72">{benefit.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="plans" className="w-full px-2 pt-16 sm:px-3 sm:pt-20 md:px-5 md:pt-24 xl:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-yellow-300/16 bg-[linear-gradient(135deg,rgba(17,17,17,0.98),rgba(71,52,0,0.98),rgba(10,10,10,0.98))] px-4 py-10 sm:rounded-[2.4rem] sm:px-6 sm:py-14 md:rounded-[2.8rem] md:px-10">
          <SectionHeading
            badge="Website Plans"
            title="Simple website plans for clients who want clear starting options."
            text="Pricing is shown in an easy format so visitors can understand the general package levels before discussing the final scope."
            align="center"
            theme="dark"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[2.2rem] p-7 ${
                  plan.featured ? 'soft-panel text-slate-950' : 'glass-panel text-white'
                }`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-[0.24em] ${
                    plan.featured ? 'text-brand-deep' : 'text-yellow-200'
                  }`}
                >
                  {plan.featured ? 'Most Popular' : 'Package'}
                </p>
                <h3 className="mt-4 font-display text-4xl font-bold sm:text-5xl">{plan.name}</h3>
                <p
                  className={`mt-5 text-2xl font-bold sm:text-3xl ${
                    plan.featured ? 'text-slate-950' : 'text-yellow-100'
                  }`}
                >
                  {plan.price}
                </p>
                <p
                  className={`mt-4 text-base leading-7 ${
                    plan.featured ? 'text-slate-700' : 'text-yellow-50/72'
                  }`}
                >
                  {plan.summary}
                </p>

                <ul
                  className={`mt-6 space-y-3 text-base leading-7 ${
                    plan.featured ? 'text-slate-700' : 'text-yellow-50/75'
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${
                          plan.featured ? 'bg-brand-deep' : 'bg-brand'
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`mt-8 inline-flex w-full sm:w-auto ${
                    plan.featured ? 'btn-dark' : 'btn-primary'
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-2 pt-16 sm:px-3 sm:pt-20 md:px-5 md:pt-24 xl:px-6">
        <SectionHeading
          badge="Website Design Steps"
          title="A simple development process that keeps the website clear, useful, and ready to launch."
          text="A good website is not only about visual design. It also needs planning, strong content structure, technical implementation, and follow-up support."
          align="center"
          theme="dark"
        />

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-yellow-200/38 to-transparent md:block" />
          <div className="grid gap-6 md:grid-cols-3">
            {launchSteps.map((step) => (
              <article
                key={step.step}
                className="glass-panel relative rounded-[2.2rem] p-7 text-center text-white"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-yellow-300/22 bg-black text-2xl font-bold text-yellow-200">
                  {step.step}
                </div>
                <h3 className="mt-6 font-display text-3xl font-bold text-yellow-100 sm:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-yellow-50/74">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-2 pt-16 sm:px-3 sm:pt-20 md:px-5 md:pt-24 xl:px-6">
        <SectionHeading
          badge="Recent Launches"
          title="Real project work gives stronger proof than generic claims."
          text="These featured launches show genuine project experience across astrology, pet care, and education websites, with live links where available."
          align="center"
          theme="dark"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {projects.slice(0, 3).map((project, index) => (
            <article
              key={project.title}
              className={`overflow-hidden rounded-[2.2rem] ${
                index === 1 ? 'soft-panel text-slate-950' : 'glass-panel text-white'
              }`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-52 w-full object-cover sm:h-[14.5rem]"
              />
              <div className="p-6">
                <p
                  className={`text-xs font-bold uppercase tracking-[0.24em] ${
                    index === 1 ? 'text-brand-deep' : 'text-yellow-200'
                  }`}
                >
                  {project.category}
                </p>
                <h3 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{project.title}</h3>
                <p
                  className={`mt-4 text-base leading-7 ${
                    index === 1 ? 'text-slate-700' : 'text-yellow-50/74'
                  }`}
                >
                  {project.result}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex w-full sm:w-auto ${
                        index === 1 ? 'btn-dark' : 'btn-primary'
                      }`}
                    >
                      {project.linkLabel ?? 'Visit Live Site'}
                    </a>
                  ) : (
                    <Link
                      to="/work"
                      className={`inline-flex w-full sm:w-auto ${
                        index === 1 ? 'btn-dark' : 'btn-primary'
                      }`}
                    >
                      View Project
                    </Link>
                  )}
                  <span
                    className={`text-[11px] font-bold uppercase tracking-[0.22em] ${
                      index === 1 ? 'text-slate-500' : 'text-yellow-50/58'
                    }`}
                  >
                    {getProjectDomain(project.url)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full px-2 pt-16 sm:px-3 sm:pt-20 md:px-5 md:pt-24 xl:px-6">
        <SectionHeading
          badge="Our Clients"
          title="Project brands and sectors you have already worked with."
          text="This section helps visitors understand your range of work across services, education, pet care, astrology, and booking-focused platforms."
          align="center"
          theme="dark"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {clientShowcase.map((client, index) => (
            <article
              key={client.name}
              className={`rounded-[2rem] p-6 text-center ${
                index % 2 === 0 ? 'glass-panel text-white' : 'soft-panel text-slate-950'
              }`}
            >
              <div
                className={`mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full text-2xl font-bold ${
                  index % 2 === 0
                    ? 'border border-yellow-300/18 bg-yellow-300/8 text-yellow-200'
                    : 'bg-black text-yellow-200'
                }`}
              >
                {client.name.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="mt-5 text-xl font-bold">{client.name}</h3>
              <p
                className={`mt-2 text-sm uppercase tracking-[0.18em] ${
                  index % 2 === 0 ? 'text-yellow-50/62' : 'text-slate-600'
                }`}
              >
                {client.tag}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full px-2 pt-16 sm:px-3 sm:pt-20 md:px-5 md:pt-24 xl:px-6">
        <div className="soft-panel rounded-[2rem] px-5 py-8 text-slate-950 sm:rounded-[2.4rem] sm:px-8 sm:py-10 md:rounded-[2.8rem] md:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-deep">
                Want to discuss project
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight font-bold sm:text-5xl md:text-6xl">
                Need a website that looks stronger and explains your business better?
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 md:text-lg">
                This homepage is now designed to attract better enquiries with clearer service messaging,
                live project proof, package visibility, and stronger calls to action. The next step can be
                adding real screenshots and refining the live enquiry backend flow.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <a
                href={phoneMethod}
                className="btn-dark w-full sm:w-auto"
              >
                Call Now
              </a>
              <Link
                to="/contact"
                className="btn-primary w-full sm:w-auto"
              >
                Get Proposal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CallToAction
        badge="Ready to grow?"
        title="Need a website that looks premium and is also ready for real business use?"
        text="If you want a responsive website, Laravel backend support, booking features, or a redesigned online presence for your business, contact me and we can discuss the right scope."
        primaryLabel="Discuss Your Website"
        primaryTo="/contact"
        secondaryLabel="See Services"
        secondaryTo="/services"
      />
    </main>
  )
}

export default HomePage
