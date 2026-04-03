import TypeText from './TypeText'

function SectionHeading({
  badge,
  title,
  text,
  align = 'left',
  theme = 'light',
  titleAs = 'h2',
}) {
  const classes =
    align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'
  const titleClass = theme === 'dark' ? 'text-white' : 'text-slate-950'
  const textClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const badgeClass =
    theme === 'dark'
      ? 'border-yellow-300/20 bg-black/45 text-yellow-200'
      : 'border-black/10 bg-black text-yellow-300'

  return (
    <div className={classes}>
      <div
        className={`pill-badge inline-flex items-center gap-2 border px-4 py-2 ${badgeClass}`}
      >
        <span className="h-2 w-2 rounded-full bg-brand" />
        <TypeText text={badge} speed={24} />
      </div>
      <TypeText
        as={titleAs}
        text={title}
        className={`mt-5 font-display text-[1.9rem] leading-tight tracking-tight sm:text-[2.4rem] md:text-5xl ${titleClass}`}
        speed={18}
      />
      <TypeText
        as="p"
        text={text}
        className={`mt-4 text-base leading-7 sm:mt-5 sm:text-lg sm:leading-8 ${textClass}`}
        speed={8}
        caret={false}
      />
    </div>
  )
}

export default SectionHeading
