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
      <div className="relative z-10">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppChatButton />
    </div>
  )
}

export default Layout
