import { createElement, useEffect, useState } from 'react'

function TypeText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  speed = 18,
  caret = true,
}) {
  const [visibleCount, setVisibleCount] = useState(0)
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!text || reducedMotion) {
      return undefined
    }

    let timerId
    let intervalId

    timerId = window.setTimeout(() => {
      let index = 0

      intervalId = window.setInterval(() => {
        index += 1
        setVisibleCount(index)

        if (index >= text.length) {
          window.clearInterval(intervalId)
        }
      }, speed)
    }, delay)

    return () => {
      window.clearTimeout(timerId)
      window.clearInterval(intervalId)
    }
  }, [delay, reducedMotion, speed, text])

  const displayedText = reducedMotion ? text : text.slice(0, visibleCount)

  return createElement(
    Tag,
    { className },
    displayedText,
    caret && !reducedMotion && visibleCount < text.length
      ? createElement('span', {
          className:
            'ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-current align-middle',
        })
      : null,
  )
}

export default TypeText
