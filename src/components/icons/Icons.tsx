export const KahaniIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      {/* Film strip border */}
      <path
        d="M2 2h2v2H2V2M2 6h2v2H2V6M2 10h2v2H2v-2M2 14h2v2H2v-2M2 18h2v2H2v-2M20 2h2v2h-2V2M20 6h2v2h-2V6M20 10h2v2h-2v-2M20 14h2v2h-2v-2M20 18h2v2h-2v-2"
        fill="currentColor"
      />
      {/* Camera body */}
      <path
        d="M12 7c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5S14.5 7 12 7zm0 7c-1.4 0-2.5-1.1-2.5-2.5S10.6 9 12 9s2.5 1.1 2.5 2.5S13.4 14 12 14z"
        fill="currentColor"
      />
      {/* Tripod */}
      <path
        d="M12 14l-1 6M12 14l1 6M12 14v6"
        strokeWidth="1"
        stroke="currentColor"
      />
      {/* Lens */}
      <circle cx="12" cy="11.5" r="1.5" fill="currentColor" />
    </svg>
  )
}
