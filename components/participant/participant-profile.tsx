'use client';

import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Instagram, Gift, MapPin, Phone } from 'lucide-react';
import { formatDates, getInitials } from '../lulus/utils';
import { Person } from '../lulus/types';
import { participants } from '../lulus/mockdata';
import { QRCodeCanvas } from 'qrcode.react';

interface ParticipantProfileProps {
  participant: Person;
}

export function ParticipantProfile({ participant }: ParticipantProfileProps) {
  const [showQR, setShowQR] = useState(false);

  // Find who this participant gives to
  const givesTo = participants.find((p) => p.id === participant.gives_to_id);

  // Find who gives to this participant
  const receivesFrom = participants.find(
    (p) => p.gives_to_id === participant.id
  );

  // Generate Pix QR code value - simple implementation
  const getPixValue = () => {
    if (participant.pix_key && participant.pix_key_type !== 'none') {
      return `${participant.pix_key} (${participant.pix_key_type})`;
    }
    return 'No PIX key available';
  };

  return (
    <div className="lulu-card">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="h-32 w-32 border-4 border-primary">
          <AvatarImage src={participant.picture} alt={participant.name} />
          <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
            {getInitials(participant.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h1 className="lulu-header text-3xl mb-1">{participant.name}</h1>
            <p className="text-lg text-muted-foreground">
              {participant.fullName}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <span>Birthday: {formatDates(new Date(participant.date))}</span>
            </div>

            {participant.instagram && (
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Instagram className="h-5 w-5 text-primary" />
                <a
                  href={`https://instagram.com/${participant.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  @{participant.instagram}
                </a>
              </div>
            )}

            <div className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{participant.city}</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <span>{participant.phone}</span>
            </div>
          </div>
        </div>

        {participant.pix_key && participant.pix_key_type !== 'none' && (
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => setShowQR(!showQR)}
              className="lulu-button text-sm"
            >
              {showQR ? 'Hide PIX' : 'Show PIX'}
            </button>

            {showQR && (
              <div className="p-4 bg-white rounded-lg">
                <QRCodeCanvas value={getPixValue()} size={128} />
                <p className="text-xs text-center mt-2">
                  {participant.pix_key}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {givesTo && (
          <div className="lulu-card bg-muted">
            <h2 className="lulu-header text-xl mb-4">Gives Gift To</h2>
            <div className="flex items-center">
              <Avatar className="h-12 w-12 border-2 border-secondary">
                <AvatarImage src={givesTo.picture} alt={givesTo.name} />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {getInitials(givesTo.name)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{givesTo.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDates(givesTo.date)}
                </p>
              </div>
            </div>
          </div>
        )}

        {receivesFrom && (
          <div className="lulu-card bg-muted">
            <h2 className="lulu-header text-xl mb-4">Receives Gift From</h2>
            <div className="flex items-center">
              <Avatar className="h-12 w-12 border-2 border-accent">
                <AvatarImage
                  src={receivesFrom.picture}
                  alt={receivesFrom.name}
                />
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {getInitials(receivesFrom.name)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{receivesFrom.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDates(receivesFrom.date)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
