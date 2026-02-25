interface HeaderProps {
  title: string;
  description?: string;
}

const Header = ({ title, description }: HeaderProps) => {
  return (
    <header className="space-y-2">
      <h1 className="lulu-header text-2xl md:text-3xl">{title}</h1>
      <p className="text-sm md:text-base text-muted-foreground">
        {description ?? ''}
      </p>
    </header>
  );
};

export default Header;
