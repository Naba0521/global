export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <polygon points="32,4 56,18 50,46 14,46 8,18" fill="#E36B2C" />
      <polygon points="32,4 32,30 8,18" fill="#C24E16" />
      <polygon points="32,4 56,18 32,30" fill="#F09255" />
      <polygon points="8,18 32,30 14,46" fill="#9C3C10" />
      <polygon points="56,18 50,46 32,30" fill="#D4622A" />
      <polygon points="14,46 50,46 32,30" fill="#E36B2C" />
    </svg>
  );
}
