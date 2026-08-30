/**
 * Kufrík — an original little-suitcase character drawn as inline SVG.
 * Deliberately not modelled on any existing app's mascot.
 */
export function Mascot({ size = 80, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Kufrík, the friendly suitcase"
    >
      <defs>
        <linearGradient id="kufrik-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc15e" />
          <stop offset="100%" stopColor="#ef8b3f" />
        </linearGradient>
      </defs>
      {/* handle */}
      <path
        d="M38 26v-4a12 12 0 0 1 24 0v4"
        fill="none"
        stroke="#8a5a2b"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* body */}
      <rect x="16" y="26" width="68" height="56" rx="16" fill="url(#kufrik-body)" />
      <rect x="16" y="26" width="68" height="56" rx="16" fill="none" stroke="#c9762a" strokeWidth="3" />
      {/* belt */}
      <rect x="16" y="48" width="68" height="9" fill="#c9762a" opacity="0.35" />
      {/* clasps */}
      <rect x="28" y="45" width="9" height="15" rx="3" fill="#fff0d4" stroke="#c9762a" strokeWidth="2" />
      <rect x="63" y="45" width="9" height="15" rx="3" fill="#fff0d4" stroke="#c9762a" strokeWidth="2" />
      {/* eyes */}
      <circle cx="38" cy="38" r="4.4" fill="#3a2a12" />
      <circle cx="62" cy="38" r="4.4" fill="#3a2a12" />
      <circle cx="39.5" cy="36.5" r="1.5" fill="#fff" />
      <circle cx="63.5" cy="36.5" r="1.5" fill="#fff" />
      {/* smile */}
      <path d="M42 68q8 7 16 0" fill="none" stroke="#3a2a12" strokeWidth="3.2" strokeLinecap="round" />
      {/* travel tag */}
      <path d="M84 40l10 6-10 6z" fill="#35c0d1" />
    </svg>
  )
}

/** Decorative dunes and palms pinned to the bottom of the viewport. */
export function Dunes({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 190"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 120 Q150 76 320 106 T640 96 T980 120 T1200 104 V190 H0Z" fill="#e9d4b3" />
      <path d="M0 148 Q210 112 430 140 T860 134 T1200 152 V190 H0Z" fill="#d9bd93" />
      {/* two palm silhouettes */}
      <g fill="#2e9166" opacity="0.55">
        <rect x="152" y="96" width="6" height="42" rx="3" />
        <path d="M155 98q-26-12-34 2 20-2 34 6zM155 98q26-12 34 2-20-2-34 6zM155 96q-6-24 8-30-2 18-2 32z" />
      </g>
      <g fill="#268059" opacity="0.45">
        <rect x="1012" y="104" width="5" height="38" rx="2.5" />
        <path d="M1014 106q-22-10-29 2 17-2 29 5zM1014 106q22-10 29 2-17-2-29 5zM1014 104q-5-20 7-26-2 15-2 27z" />
      </g>
    </svg>
  )
}
