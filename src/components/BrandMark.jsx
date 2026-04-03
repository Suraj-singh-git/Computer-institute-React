import { useId } from 'react'
import TypeText from './TypeText'

function BrandMark({ compact = false, invert = false }) {
  const gradientId = useId().replace(/:/g, '')
  const titleClass = invert ? 'text-yellow-300' : 'text-yellow-300'
  const textClass = invert ? 'text-yellow-100/80' : 'text-yellow-100/80'

  return (
    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <svg
        viewBox="0 0 64 64"
        className="h-9 w-9 shrink-0 sm:h-11 sm:w-11"
        role="img"
        aria-label="S and D Developers logo"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe66d" />
            <stop offset="100%" stopColor="#ffd21f" />
          </linearGradient>
        </defs>
     
        
      </svg>
      <div className="min-w-0">
        <TypeText
          as="p"
          text="S&D Developers"
          className={`font-brand-script text-[1.22rem] leading-none tracking-tight sm:text-[1.9rem] ${titleClass}`}
          speed={34}
        />
        {!compact ? (
          <TypeText
            as="p"
            text="Laravel development, websites, APIs, and integrations"
            className={`text-base leading-6 ${textClass}`}
            speed={12}
            caret={false}
          />
        ) : null}
      </div>
    </div>
  )
}

export default BrandMark
