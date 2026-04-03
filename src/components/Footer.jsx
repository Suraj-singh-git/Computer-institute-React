import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'
import TypeText from './TypeText'
import { buildWhatsAppHref } from '../utils/contact'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 mt-16 border-t border-yellow-300/12 bg-[#040404]/88 text-white backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.5fr_1fr_1fr] md:px-6">
        <div className="space-y-4">
          <BrandMark invert />
          <TypeText
            as="p"
            text="Personal portfolio and business website of Suraj Singh, focused on Laravel development, business websites, APIs, payment integration, and backend features for real products."
            className="max-w-md text-base leading-8 text-yellow-100/75"
            speed={7}
            caret={false}
          />
          <div className="pill-badge inline-flex border border-yellow-300/20 bg-black/45 px-4 py-2 text-yellow-100/80">
            Available for freelance and contract work
          </div>
        </div>

        <div>
          <h3 className="font-display text-[2rem] text-yellow-200">Pages</h3>
          <div className="mt-4 flex flex-col gap-3 text-base text-yellow-100/80">
            <Link to="/" className="transition hover:text-yellow-200">
              Home
            </Link>
            <Link to="/services" className="transition hover:text-yellow-200">
              Services
            </Link>
            <Link to="/work" className="transition hover:text-yellow-200">
              Work
            </Link>
            <Link to="/about" className="transition hover:text-yellow-200">
              About
            </Link>
            <Link to="/contact" className="transition hover:text-yellow-200">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-display text-[2rem] text-yellow-200">Contact</h3>
          <div className="mt-4 space-y-3 text-base text-yellow-100/80">
            <a
              href="mailto:surajsingh20796@gmail.com"
              className="block transition hover:text-yellow-200"
            >
              surajsingh20796@gmail.com
            </a>
            <a
              href="tel:+918738917652"
              className="block transition hover:text-yellow-200"
            >
              +91 87389 17652
            </a>
            <a
              href={buildWhatsAppHref()}
              target="_blank"
              rel="noreferrer"
              className="block transition hover:text-yellow-200"
            >
              Chat on WhatsApp
            </a>
            <p>Hata, Kushinagar, Uttar Pradesh</p>
          </div>
        </div>
      </div>
      <div className="border-t border-yellow-300/12 px-4 py-5 text-center text-sm text-yellow-100/55 md:px-6">
        Copyright {year} S&amp;D Developers. Portfolio of Suraj Singh, built in
        React and Tailwind CSS.
      </div>
    </footer>
  )
}

export default Footer
