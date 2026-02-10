'use client';

import { useEffect, useRef } from 'react';

interface LiveAnnounceProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  clearDelay?: number;
}

export const LiveAnnounce = ({
  message,
  politeness = 'polite',
  clearDelay = 5000,
}: LiveAnnounceProps) => {
  const messageRef = useRef<string>(message);

  useEffect(() => {
    messageRef.current = message;

    if (clearDelay > 0) {
      const timer = setTimeout(() => {
        messageRef.current = '';
      }, clearDelay);

      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [message, clearDelay]);

  if (!message) {
    return null;
  }

  return (
    <output aria-live={politeness} aria-atomic="true" className="sr-only">
      {message}
    </output>
  );
};
