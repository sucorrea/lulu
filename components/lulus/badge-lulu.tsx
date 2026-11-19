interface BadgeLuluProps {
  value: number | string;
  label: string;
  testId?: string;
}

const BadgeLulu = ({ value, label, testId = 'badge-lulu' }: BadgeLuluProps) => (
  <p
    data-testid={testId}
    className="flex items-center gap-2 px-4 text-sm font-medium text-muted-foreground first:pl-0"
  >
    <span className="font-serif text-3xl font-bold leading-none text-primary lining-nums">
      {value}
    </span>
    {label}
  </p>
);

export default BadgeLulu;
