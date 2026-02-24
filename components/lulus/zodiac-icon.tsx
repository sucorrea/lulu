interface ZodiacIconProps {
  icon: string;
  className?: string;
}

const ZodiacIcon = ({ icon, className }: ZodiacIconProps) => (
  <span
    role="img"
    aria-hidden="true"
    className={className}
    style={{
      display: 'inline-block',
      width: '0.875rem',
      height: '0.875rem',
      flexShrink: 0,
      WebkitMaskImage: `url('/icons/zodiac/${icon}.svg')`,
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskSize: 'contain',
      WebkitMaskPosition: 'center',
      maskImage: `url('/icons/zodiac/${icon}.svg')`,
      maskRepeat: 'no-repeat',
      maskSize: 'contain',
      maskPosition: 'center',
      backgroundColor: 'currentColor',
    }}
  />
);

export default ZodiacIcon;
