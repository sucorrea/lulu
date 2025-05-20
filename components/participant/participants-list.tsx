'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { participants } from '../lulus/mockdata';
import { getInitials } from '../lulus/utils';

export function ParticipantsList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search friends..."
          className="pl-10 h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filteredParticipants.map((participant) => (
          <Link
            href={`/participants/${participant.id}`}
            key={participant.id}
            className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={participant.picture} alt={participant.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(participant.name)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="font-medium">{participant.name}</p>
              <p className="text-sm text-muted-foreground">
                Gives to: {participant.gives_to}
              </p>
            </div>
          </Link>
        ))}

        {filteredParticipants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No friends found</p>
          </div>
        )}
      </div>
    </div>
  );
}
