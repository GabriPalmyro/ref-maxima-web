"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 10,
  onComplete,
}: TypewriterTextProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!text) return;
    setDisplayedLength(0);

    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = Math.min(prev + 3, text.length);
        if (next >= text.length) {
          clearInterval(interval);
          onCompleteRef.current?.();
        }
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  const isTyping = displayedLength < text.length;

  return (
    <span>
      {text.slice(0, displayedLength)}
      {isTyping && (
        <span className="animate-pulse text-zinc-400">▌</span>
      )}
    </span>
  );
}
