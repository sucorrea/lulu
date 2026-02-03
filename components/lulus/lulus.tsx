'use client';
import LulusInteractive from './lulus-interactive';
import { Person } from './types';

interface LulusProps {
  participants: Person[];
}

const Lulus = ({ participants }: LulusProps) => {
  return <LulusInteractive initialParticipants={participants} />;
};

export default Lulus;
