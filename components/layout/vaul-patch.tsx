'use client';

import { useEffect } from 'react';

/**
 * Patches Element.prototype.releasePointerCapture to swallow the NotFoundError
 * thrown by vaul's internal draggable when the pointer is already released.
 * https://github.com/emilkowalski/vaul/issues/548
 */
export const VaulPatch = () => {
  useEffect(() => {
    const original = Element.prototype.releasePointerCapture;

    Element.prototype.releasePointerCapture = function (pointerId: number) {
      try {
        original.call(this, pointerId);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'NotFoundError') {
          // vaul calls this after the pointer was already released — safe to ignore
          return;
        }
        throw e;
      }
    };

    return () => {
      Element.prototype.releasePointerCapture = original;
    };
  }, []);

  return null;
};
