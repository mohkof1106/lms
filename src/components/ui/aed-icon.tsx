interface AedIconProps {
  className?: string;
}

export function AedIcon({ className }: AedIconProps) {
  return (
    <span className={`dirham-symbol ${className || ''}`} aria-label="AED">
      &#xea;
    </span>
  );
}
