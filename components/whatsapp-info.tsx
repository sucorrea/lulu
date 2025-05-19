'use client';

import Image from 'next/image';
import Link from 'next/link';

import { formatToPhone } from 'brazilian-values';

import { LINK_WHATSAPP } from './lulus/constants';
import { Person } from './lulus/types';

interface WhatsappInfoProps {
  participant: Person;
}

const WhatsappInfo = ({ participant }: WhatsappInfoProps) => {
  return (
    <div className="flex items-center text-gray-600 text-xs pb-2">
      <Link href={`${LINK_WHATSAPP}${participant.phone}`} target="_blank">
        <Image
          src="/whatsapp.svg"
          alt="Whatsapp"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <span className="ml-1 text-xs">
          {formatToPhone(participant.phone ?? '')}
        </span>
      </Link>
    </div>
  );
};

export default WhatsappInfo;
