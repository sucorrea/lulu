'use client';

import { useEffect, useState } from 'react';

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
  const [displayedMessage, setDisplayedMessage] = useState(message);

  useEffect(() => {
    setDisplayedMessage(message);

    if (clearDelay > 0 && message) {
      const timer = setTimeout(() => {
        setDisplayedMessage('');
      }, clearDelay);

      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [message, clearDelay]);

  if (!displayedMessage) {
    return null;
  }

  return (
    <output aria-live={politeness} aria-atomic="true" className="sr-only">
      {displayedMessage}
    </output>
  );
};
