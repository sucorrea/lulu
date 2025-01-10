import Link from 'next/link';
import { ReactNode } from 'react';

interface LinkIconWithTextProps {
  link: string;
  text: string;
  children: ReactNode;
}
const LinkIconWithText = ({ link, text, children }: LinkIconWithTextProps) => (
  <Link href={link} target="_blank">
    <div className="flex items-center gap-2">
      {children}
      <p>{text}</p>
    </div>
  </Link>
);

export default LinkIconWithText;
