import { ReactNode } from 'react';

import Link from 'next/link';

interface LinkIconWithTextProps {
  link: string;
  text: string;
  children: ReactNode;
  showDescription?: boolean;
}

const LinkIconWithText = ({
  link,
  text,
  children,
  showDescription,
}: LinkIconWithTextProps) => (
  <Link href={link} target="_blank">
    <div className="flex items-center flex-colgap-2">
      {children}
      {!!showDescription && <p className="md:text-sm xs: text-xs">{text}</p>}
    </div>
  </Link>
);

export default LinkIconWithText;
