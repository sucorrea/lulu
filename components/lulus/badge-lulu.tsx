interface BadgeLuluProps {
  text: string;
}

const BadgeLulu = ({ text }: BadgeLuluProps) => (
  <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
    {text}
  </span>
);

export default BadgeLulu;
