import CallToAction from '../components/CallToAction'
import PageMeta from '../components/PageMeta'
import SectionHeading from '../components/SectionHeading'
import { projects } from '../data/siteContent'

function getProjectDomain(url) {
  if (!url) {
    return 'Private client project'
  }

  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

function WorkPage() {
  return (
    <main className="pb-10">
      <PageMeta
        title="Web Development Portfolio | S&D Developers"
        description="See selected web development projects by Suraj Singh, including The Taramandal, Supawtails, UTEI, service websites, Laravel platforms, booking systems, and payment integration work."
        pageType="CollectionPage"
      />

      <section className="mx-auto max-w-7xl px-2 pt-8 sm:px-3 md:px-6 md:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="glass-panel rounded-[2.4rem] p-6 sm:p-8 md:p-10">
            <SectionHeading
              badge="Selected Projects"
              title="Real client work across service websites, platforms, and feature-rich business builds."
              text="This portfolio includes genuine project references such as The Taramandal, Supawtails, and UTEI, along with other builds that involved Laravel development, booking flows, APIs, and admin functionality."
              theme="dark"
              titleAs="h1"
            />
          </div>
          <div className="soft-panel overflow-hidden rounded-[2.4rem] p-3">
            <div className="relative overflow-hidden rounded-[1.8rem]">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
                alt="Team working on modern product and backend systems"
                className="h-[260px] w-full object-cover sm:h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-2 sm:px-3 md:mt-24 md:px-6">
        <div className="grid gap-8">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className={`overflow-hidden rounded-[2.4rem] ${
                index % 2 === 0 ? 'soft-panel text-slate-950' : 'glass-panel text-white'
              }`}
            >
              <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
                <img
                  src={project.image}
                  alt={project.title}
                  className={`h-full min-h-[260px] w-full object-cover sm:min-h-[320px] ${
                    index % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                />
                <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
                  <p
                    className={`text-xs font-bold uppercase tracking-[0.26em] ${
                      index % 2 === 0 ? 'text-brand' : 'text-yellow-200'
                    }`}
                  >
                    {project.category}
                  </p>
                  <h2 className="mt-4 font-display text-[2rem] font-bold tracking-tight sm:text-4xl">
                    {project.title}
                  </h2>
                  <p
                    className={`mt-4 text-base font-semibold leading-7 sm:mt-5 sm:text-lg sm:leading-8 ${
                      index % 2 === 0 ? 'text-slate-700' : 'text-slate-200'
                    }`}
                  >
                    {project.result}
                  </p>
                  <p
                    className={`mt-4 text-base leading-7 sm:text-lg sm:leading-8 ${
                      index % 2 === 0 ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {project.summary}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                          index % 2 === 0
                            ? 'bg-slate-950 text-white'
                            : 'chip-strong'
                        }`}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className={index % 2 === 0 ? 'btn-dark' : 'btn-primary'}
                      >
                        {project.linkLabel ?? 'Visit Live Site'}
                      </a>
                    ) : (
                      <span
                        className={`rounded-full px-5 py-3 text-sm font-semibold ${
                          index % 2 === 0
                            ? 'bg-slate-950/8 text-slate-700'
                            : 'chip-strong'
                        }`}
                      >
                        Live link available on request
                      </span>
                    )}
                    <span
                      className={`text-xs font-bold uppercase tracking-[0.22em] ${
                        index % 2 === 0 ? 'text-slate-500' : 'text-yellow-100/55'
                      }`}
                    >
                      {getProjectDomain(project.url)}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CallToAction
        badge="Need similar development support?"
        title="If you need a website or platform with both presentation quality and practical backend execution, let's build it properly."
        text="From service websites to booking logic, payment flows, admin tools, and Laravel backend development, I can help where the project needs both design care and technical execution."
        primaryLabel="Discuss a Project"
        primaryTo="/contact"
        secondaryLabel="See Services"
        secondaryTo="/services"
      />
    </main>
  )
}

export default WorkPage
