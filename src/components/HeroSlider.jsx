import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TypeText from './TypeText'

function SlideAction({ to, label, variant = 'primary' }) {
  if (!to || !label) {
    return null
  }

  const className =
    variant === 'primary'
      ? 'btn-primary w-full sm:w-auto'
      : 'btn-secondary w-full sm:w-auto'

  if (to.startsWith('/')) {
    return (
      <Link to={to} className={className}>
        {label}
      </Link>
    )
  }

  return (
    <a href={to} className={className}>
      {label}
    </a>
  )
}

function HeroSlider({ slides, stats = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!slides?.length || slides.length < 2) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length)
    }, 6000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [slides])

  if (!slides?.length) {
    return null
  }

  const activeSlide = slides[activeIndex]

  return (
    <section className="w-full px-2 pt-5 sm:px-3 md:px-5 md:pt-8 xl:px-6">
      <div className="hero-frame relative overflow-hidden rounded-[2rem] border border-yellow-300/16 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:rounded-[2.4rem] lg:rounded-[2.8rem]">
        <div className="absolute inset-0">
          <img
            key={activeSlide.image}
            src={activeSlide.image}
            alt={activeSlide.title}
            className="hero-slide-image h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4),rgba(0,0,0,0.62)),linear-gradient(90deg,rgba(0,0,0,0.84),rgba(0,0,0,0.25),rgba(0,0,0,0.84))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,210,31,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(255,210,31,0.16),transparent_28%)]" />
        </div>

        <div className="relative z-10 px-4 py-8 text-center sm:px-5 sm:py-10 md:px-8 lg:flex lg:h-full lg:items-center lg:justify-center lg:px-16 lg:py-10 lg:pb-36">
          <div key={activeSlide.title} className="mx-auto max-w-4xl">
            <div className="pill-badge inline-flex items-center gap-2 border border-yellow-200/20 bg-black/52 px-4 py-2 text-yellow-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-brand [animation:pulseGlow_4s_ease-in-out_infinite]" />
              <TypeText text={activeSlide.eyebrow} speed={24} />
            </div>

            <TypeText
              as="h1"
              text={activeSlide.title}
              className="hero-title mt-5 font-display text-[clamp(1.75rem,9vw,4.25rem)] text-yellow-200 sm:mt-6"
              speed={15}
            />

            <TypeText
              as="p"
              text={activeSlide.text}
              className="mx-auto mt-4 max-w-2xl text-[0.98rem] leading-7 text-yellow-50/88 sm:mt-5 sm:text-lg sm:leading-8"
              speed={8}
              caret={false}
            />

            <div className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <div className="w-full sm:w-auto">
                <SlideAction to={activeSlide.primaryTo} label={activeSlide.primaryLabel} />
              </div>
              <SlideAction
                to={activeSlide.secondaryTo}
                label={activeSlide.secondaryLabel}
                variant="secondary"
              />
            </div>

            {stats.length ? (
              <div className="mx-auto mt-6 grid max-w-xl gap-3 sm:mt-8 sm:max-w-4xl sm:grid-cols-3 sm:gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.35rem] border border-yellow-200/18 bg-black/58 px-3 py-3 backdrop-blur sm:rounded-[1.8rem] sm:px-5 sm:py-5"
                  >
                    <p className="font-display text-[1.45rem] text-yellow-200 sm:text-[2.2rem]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-yellow-50/82 sm:mt-2 sm:text-base sm:leading-7">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative z-20 px-3 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-3 lg:absolute lg:bottom-6 lg:left-6 lg:right-6 lg:px-0 lg:pb-0 lg:pt-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-nowrap items-center gap-3 overflow-x-auto rounded-[1.5rem] border border-yellow-200/12 bg-black/40 px-3 py-3 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:rounded-full lg:flex-wrap lg:justify-start">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`pill-badge px-4 py-2 transition ${
                    index === activeIndex
                      ? 'bg-brand text-black shadow-lg shadow-brand/20'
                      : 'border border-yellow-200/18 bg-black/58 text-yellow-50 backdrop-blur hover:bg-black/76'
                  }`}
                  aria-label={`Show slide ${index + 1}`}
                >
                  {slide.eyebrow}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 rounded-[1.5rem] border border-yellow-200/12 bg-black/40 px-3 py-3 backdrop-blur sm:rounded-full lg:justify-end">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((currentIndex) =>
                    currentIndex === 0 ? slides.length - 1 : currentIndex - 1,
                  )
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border border-yellow-200/18 bg-black/62 text-xl text-yellow-50 backdrop-blur transition hover:bg-black/78"
                aria-label="Previous slide"
              >
                {'<'}
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length)
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border border-yellow-200/18 bg-black/62 text-xl text-yellow-50 backdrop-blur transition hover:bg-black/78"
                aria-label="Next slide"
              >
                {'>'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
