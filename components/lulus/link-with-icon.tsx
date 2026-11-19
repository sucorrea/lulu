import { ReactNode } from 'react';

import Link from 'next/link';

interface LinkIconWithTextProps {
  link: string;
  text: string;
  icon: ReactNode;
  showDescription?: boolean;
}

const LinkIconWithText = ({
  link,
  text,
  icon,
  showDescription,
}: LinkIconWithTextProps) => (
  <Link
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="min-w-0 max-w-full"
    title={text}
  >
    <div className="flex min-w-0 items-center gap-1">
      {icon}
      {!!showDescription && <p className="truncate">{text}</p>}
    </div>
  </Link>
);

export default LinkIconWithText;
