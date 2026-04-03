const icons = {
  website: (
    <path
      d="M7 10.5h26m-26 7h26m-26 7h14m-19-19h24a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-17a3 3 0 0 1 3-3Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  launch: (
    <path
      d="m20 5 3.7 7.5L31 16l-7.3 3.5L20 27l-3.7-7.5L9 16l7.3-3.5L20 5Zm-9 20h4m10 0h4M7 29h26"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  app: (
    <path
      d="M9 7h10v10H9zm14 0h8v6h-8zm0 10h8v10h-8zM9 21h10v6H9z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  refresh: (
    <path
      d="M30 11v8h-8m-8 10v-8h8m8 8a11 11 0 0 1-18.7 4.5M14 11A11 11 0 0 1 32.7 15.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
}

function ServiceIcon({ type }) {
  return (
    <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-yellow-300/20 bg-yellow-300/8 text-brand shadow-lg shadow-black/10 backdrop-blur">
      <svg viewBox="0 0 38 38" className="h-8 w-8" aria-hidden="true">
        {icons[type]}
      </svg>
    </div>
  )
}

export default ServiceIcon
