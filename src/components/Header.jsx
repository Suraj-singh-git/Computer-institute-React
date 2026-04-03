import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import BrandMark from './BrandMark'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function getLinkClass({ isActive }) {
  return [
    'rounded-full border px-4 py-2.5 text-[1.02rem] leading-none transition',
    isActive
      ? 'border-brand bg-brand text-black shadow-lg shadow-brand/20'
      : 'border-transparent bg-black/20 text-yellow-50 hover:border-yellow-300/16 hover:bg-black/55 hover:text-yellow-100',
  ].join(' ')
}

function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-2 pt-3 sm:px-3 md:px-5 md:pt-4 xl:px-6">
      <div className="glass-panel w-full rounded-[1.75rem] px-3 py-3 sm:px-4 md:rounded-full md:px-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NavLink to="/" onClick={() => setIsOpen(false)}>
              <BrandMark compact invert />
            </NavLink>
            <div className="pill-badge hidden border border-yellow-300/20 bg-black/45 px-3 py-1.5 text-yellow-100 xl:flex xl:items-center xl:gap-2">
              <span className="h-2 w-2 rounded-full bg-brand [animation:pulseGlow_4s_ease-in-out_infinite]" />
              Available For Projects
            </div>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={getLinkClass}>
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className="btn-primary ml-2 px-5 sm:px-6"
            >
              Start a Project
            </NavLink>
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="btn-secondary px-4 lg:hidden"
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>

        {isOpen ? (
          <div className="mt-4 border-t border-yellow-300/12 pt-4 lg:hidden">
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={getLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/contact"
                className="btn-primary mt-2"
                onClick={() => setIsOpen(false)}
              >
                Start a Project
              </NavLink>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default Header
