'use client';

import Image from 'next/image';
import Link from 'next/link';

import { LINK_WHATSAPP } from './lulus/constants';
import { Person } from './lulus/types';

interface WhatsappInfoProps {
  participant: Person;
}

const WhatsappInfo = ({ participant }: WhatsappInfoProps) => (
  <Link
    href={`${LINK_WHATSAPP}${participant.phone}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-success/15 px-3 text-sm font-bold text-success transition-colors hover:bg-success/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <Image
      src="/whatsapp.svg"
      alt=""
      width={20}
      height={20}
      sizes="20px"
      className="h-5 w-5"
    />
    WhatsApp
  </Link>
);

export default WhatsappInfo;
