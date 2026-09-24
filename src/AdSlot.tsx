import { useEffect, useState } from 'react'
import { getStoredConsent } from './analytics'

const AD_CLIENT = 'ca-pub-4561414438757131'
const AD_SLOT = '9498997288'

/**
 * Manual, responsive ad unit. Unlike auto ads (turned off in analytics.ts), this
 * component should only be used on screens with substantial real content (e.g. a
 * finished game's final standings) — never on the live/active scoring screen —
 * to respect AdSense's policy on ads served on screens with no publisher content.
 */
export default function AdSlot() {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    setGranted(getStoredConsent() === 'granted')
  }, [])

  useEffect(() => {
    if (!granted) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      /* script not loaded yet, or blocked by an ad blocker */
    }
  }, [granted])

  if (!granted) return null

  return (
    <div className="ad-slot">
      <span className="ad-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
