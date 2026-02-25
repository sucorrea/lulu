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
  const [prevMessage, setPrevMessage] = useState(message);
  const [isCleared, setIsCleared] = useState(false);

  if (prevMessage !== message) {
    setPrevMessage(message);
    setIsCleared(false);
  }

  useEffect(() => {
    if (clearDelay > 0 && message) {
      const timer = setTimeout(() => {
        setIsCleared(true);
      }, clearDelay);

      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [message, clearDelay]);

  const displayedMessage = isCleared ? '' : message;

  if (!displayedMessage) {
    return null;
  }

  return (
    <output aria-live={politeness} aria-atomic="true" className="sr-only">
      {displayedMessage}
    </output>
  );
};
