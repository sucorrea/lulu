import Link from 'next/link';
import { ReactNode } from 'react';

interface LinkIconWithTextProps {
  link: string;
  text: string;
  children: ReactNode;
}
const LinkIconWithText = ({ link, text, children }: LinkIconWithTextProps) => (
  <Link href={link} target="_blank">
    <div className="flex items-center flex-colgap-2">
      {children}
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  </Link>
);

export default LinkIconWithText;
