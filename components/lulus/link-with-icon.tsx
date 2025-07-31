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
  <Link href={link} target="_blank" rel="noopener noreferrer">
    <div className="flex items-center flex-colgap-2">
      {icon}
      {!!showDescription && <p className="md:text-sm xs: text-xs">{text}</p>}
    </div>
  </Link>
);

export default LinkIconWithText;
