interface HeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

const Header = ({ title, description, eyebrow }: HeaderProps) => {
  return (
    <header className="space-y-2">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-widest text-gold">
          {eyebrow}
        </p>
      )}
      <h1 className="lulu-header text-2xl md:text-3xl">{title}</h1>
      <p className="text-sm md:text-base text-muted-foreground">
        {description ?? ''}
      </p>
    </header>
  );
};

export default Header;
