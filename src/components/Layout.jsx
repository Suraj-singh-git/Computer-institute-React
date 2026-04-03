import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import ScrollToTop from './ScrollToTop'
import SiteBackdrop from './SiteBackdrop'
import WhatsAppChatButton from './WhatsAppChatButton'

function Layout() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteBackdrop />
      <ScrollToTop />
      <Header />
      <div className="relative z-10 pt-[5.7rem] sm:pt-[6.2rem] md:pt-[6.8rem]">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppChatButton />
    </div>
  )
}

export default Layout
