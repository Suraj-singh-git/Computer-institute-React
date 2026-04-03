import { buildWhatsAppHref } from '../utils/contact'

function WhatsAppChatButton() {
  return (
    <a
      href={buildWhatsAppHref()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-3 right-3 z-[70] inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-[#111]/92 px-2.5 py-2.5 text-white shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#191919] sm:bottom-5 sm:right-5 sm:gap-3 sm:px-4 sm:py-3"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-[#07120b] sm:h-10 sm:w-10">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M19.05 4.94A9.77 9.77 0 0 0 12.09 2C6.67 2 2.26 6.4 2.26 11.83c0 1.73.45 3.43 1.31 4.93L2 22l5.4-1.42a9.8 9.8 0 0 0 4.69 1.2h.01c5.42 0 9.83-4.4 9.83-9.83a9.75 9.75 0 0 0-2.88-7.01Zm-6.95 15.18h-.01a8.16 8.16 0 0 1-4.16-1.14l-.3-.18-3.2.84.85-3.12-.2-.32a8.14 8.14 0 0 1-1.25-4.37c0-4.5 3.66-8.16 8.18-8.16 2.18 0 4.24.84 5.78 2.39a8.1 8.1 0 0 1 2.38 5.78c0 4.5-3.66 8.16-8.17 8.16Zm4.47-6.12c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.57.12-.17.25-.65.8-.8.96-.15.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.57-1.37-.78-1.88-.2-.48-.4-.42-.57-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08s.89 2.42 1.02 2.58c.12.17 1.75 2.67 4.25 3.74.59.25 1.06.4 1.42.51.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.17-.48-.29Z" />
        </svg>
      </span>
      <span className="hidden text-left sm:block">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300/80">
          Quick Chat
        </span>
        <span className="block text-sm font-semibold text-white">WhatsApp</span>
      </span>
    </a>
  )
}

export default WhatsAppChatButton
