import { Link } from 'react-router-dom'
import TypeText from './TypeText'

function CallToAction({
  badge = 'Ready to grow?',
  title,
  text,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}) {
  return (
    <section className="w-full px-2 py-16 sm:px-3 md:px-5 md:py-20 xl:px-6">
      <div className="glass-panel relative overflow-hidden rounded-[2rem] px-5 py-10 text-white sm:rounded-[2.2rem] sm:px-7 md:rounded-[2.5rem] md:px-12 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,210,31,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,232,90,0.22),transparent_24%),linear-gradient(135deg,rgba(3,3,3,0.98),rgba(14,14,14,0.94))]" />
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-yellow-300/20 [animation:drift_16s_ease-in-out_infinite]" />
        <div className="absolute bottom-6 left-10 hidden h-px w-48 bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent md:block" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="pill-badge inline-flex items-center gap-2 border border-yellow-300/20 bg-black/45 px-4 py-2 text-yellow-200">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <TypeText text={badge} speed={24} />
            </div>
            <TypeText
              as="h2"
              text={title}
              className="mt-4 font-display text-[2rem] leading-tight tracking-tight text-yellow-200 sm:text-[2.7rem] md:text-6xl"
              speed={16}
            />
            <TypeText
              as="p"
              text={text}
              className="mt-4 max-w-2xl text-base leading-7 text-yellow-50/80 sm:mt-5 sm:text-lg sm:leading-8"
              speed={8}
              caret={false}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
            <Link
              to={primaryTo}
              className="btn-primary w-full sm:w-auto"
            >
              {primaryLabel}
            </Link>
            {secondaryLabel && secondaryTo ? (
              <Link
                to={secondaryTo}
                className="btn-secondary w-full sm:w-auto"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
