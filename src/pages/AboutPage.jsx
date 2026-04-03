import CallToAction from '../components/CallToAction'
import PageMeta from '../components/PageMeta'
import ProfilePhoto from '../components/ProfilePhoto'
import SectionHeading from '../components/SectionHeading'
import {
  aboutStats,
  education,
  experienceTimeline,
  processSteps,
} from '../data/siteContent'

const values = [
  {
    title: 'Business-first thinking',
    text: 'I focus on what the website or platform needs to achieve for the client, not only how it looks on the screen.',
  },
  {
    title: 'Practical delivery',
    text: 'The work I enjoy most solves real product needs such as enquiries, bookings, payments, APIs, admin flows, and user communication.',
  },
  {
    title: 'Continuous learning',
    text: 'I improve through repeated research, careful iteration, and constant effort to sharpen both design quality and development quality.',
  },
]

function AboutPage() {
  return (
    <main className="pb-10">
      <PageMeta
        title="About Suraj Singh | Laravel Developer and Website Designer"
        description="Learn about Suraj Singh, MCA graduate and Laravel developer with hands-on experience in business websites, backend systems, APIs, payment integrations, and responsive web development."
        pageType="AboutPage"
      />

      <section className="mx-auto max-w-7xl px-2 pt-8 sm:px-3 md:px-6 md:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="soft-panel overflow-hidden rounded-[2.4rem] p-3">
            <div className="relative overflow-hidden rounded-[1.8rem]">
              <ProfilePhoto
                alt="Suraj Singh profile portrait"
                className="h-[360px] w-full object-cover sm:h-[440px] lg:h-[520px]"
                objectPosition="center 18%"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
            </div>
          </div>

          <div className="glass-panel rounded-[2.4rem] p-8 md:p-10">
            <SectionHeading
              badge="About Me"
              title="Laravel developer with hands-on experience in business websites, backend systems, and integration-heavy features."
              text="I am Suraj Singh, an MCA graduate and working web developer with experience in Laravel applications, responsive business websites, booking systems, payment integrations, Firebase chat, and REST APIs."
              theme="dark"
              titleAs="h1"
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {aboutStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.6rem] border border-yellow-300/16 bg-yellow-300/7 p-5"
                >
                  <p className="font-display text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-base leading-7 text-slate-300">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-2 sm:px-3 md:mt-24 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value, index) => (
            <article
              key={value.title}
              className={`rounded-[2.2rem] p-8 ${
                index === 1 ? 'glass-panel text-white' : 'soft-panel text-slate-950'
              }`}
            >
              <h3 className="font-display text-[1.9rem] font-bold sm:text-3xl">{value.title}</h3>
              <p
                className={`mt-4 text-lg leading-8 ${
                  index === 1 ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-2 sm:px-3 md:mt-24 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
          <div className="glass-panel rounded-[2.4rem] p-8 md:p-10">
            <SectionHeading
              badge="Experience"
              title="Professional roles that shaped my backend and product development approach."
              text="My experience includes real company work across scalable APIs, dynamic websites, admin systems, third-party integrations, and user-facing business features."
              theme="dark"
            />
          </div>

          <div className="grid gap-5">
            {experienceTimeline.map((item, index) => (
              <article
                key={`${item.company}-${item.duration}`}
                className={`rounded-[2.2rem] p-8 ${
                  index === 0 ? 'soft-panel text-slate-950' : 'glass-panel text-white'
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p
                      className={`text-xs font-bold uppercase tracking-[0.24em] ${
                        index === 0 ? 'text-brand' : 'text-yellow-200'
                      }`}
                    >
                      {item.role}
                    </p>
                    <h3 className="mt-3 font-display text-[1.9rem] font-bold sm:text-3xl">
                      {item.company}
                    </h3>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      index === 0 ? 'text-slate-500' : 'text-slate-300'
                    }`}
                  >
                    {item.duration}
                  </p>
                </div>
                <ul
                  className={`mt-6 space-y-3 text-lg leading-8 ${
                    index === 0 ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-2 sm:px-3 md:mt-24 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="soft-panel rounded-[2.3rem] p-8 text-slate-950 md:p-10">
            <SectionHeading
              badge="Education"
              title="Academic foundation that supports practical web development work."
              text="My formal education gave me the technical base that I later applied to real-world websites, Laravel development, and backend integration projects."
            />
            <div className="mt-8 space-y-4">
              {education.map((item) => (
                <article
                  key={`${item.degree}-${item.year}`}
                  className="rounded-[1.6rem] border border-slate-900/8 bg-slate-950/3 p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">
                    {item.year}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-bold">
                    {item.degree}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {item.school}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2.3rem] p-8 md:p-10">
            <SectionHeading
              badge="Workflow"
              title="How I keep development clean, controlled, and ready for launch."
              text="A good process matters even more than visual style. This is the workflow I follow to keep projects practical and manageable."
              theme="dark"
            />
            <div className="mt-8 space-y-4">
              {processSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[1.6rem] border border-yellow-300/16 bg-yellow-300/7 p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-200">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-300">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CallToAction
        badge="Need a dependable developer?"
        title="Work with a developer who values both technical execution and presentation quality."
        text="If you need business website development, Laravel support, APIs, payment gateways, booking features, or a cleaner online presence, let's discuss the project."
        primaryLabel="Talk to Suraj Singh"
        primaryTo="/contact"
        secondaryLabel="Explore Services"
        secondaryTo="/services"
      />
    </main>
  )
}

export default AboutPage
