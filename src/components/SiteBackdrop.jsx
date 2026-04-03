function SiteBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="spot-orb left-[-8rem] top-[4rem] h-[24rem] w-[24rem] bg-brand/30 [animation:floatSlow_16s_ease-in-out_infinite]" />
      <div className="spot-orb right-[-10rem] top-[10rem] h-[28rem] w-[28rem] bg-yellow-300/16 [animation:drift_20s_ease-in-out_infinite]" />
      <div className="spot-orb bottom-[-10rem] left-[22%] h-[26rem] w-[26rem] bg-amber-300/12 [animation:floatReverse_18s_ease-in-out_infinite]" />
      <div className="absolute left-[12%] top-[9rem] h-24 w-24 rounded-full border border-yellow-300/18 [animation:pulseGlow_6s_ease-in-out_infinite]" />
      <div className="absolute right-[16%] top-[24rem] h-40 w-40 rounded-full border border-yellow-200/8 [animation:floatSlow_10s_ease-in-out_infinite]" />
      <div className="absolute inset-x-0 top-[38rem] h-px bg-gradient-to-r from-transparent via-yellow-300/16 to-transparent" />
    </div>
  )
}

export default SiteBackdrop
