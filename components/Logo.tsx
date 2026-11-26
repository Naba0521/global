export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <g stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
        <polygon points="16,2.2 27.2,8.6 27.2,21.6 16,29.8 4.8,21.6 4.8,8.6" />
        <polyline points="16,2.2 16,15.2 4.8,8.6" />
        <polyline points="27.2,8.6 16,15.2 27.2,21.6" />
        <polyline points="4.8,21.6 16,15.2 16,29.8" />
        <polyline points="4.8,21.6 16,23.4 27.2,21.6" />
        <polyline points="4.8,8.6 16,15.2 27.2,8.6" />
      </g>
    </svg>
  );
}
