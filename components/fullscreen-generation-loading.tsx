"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/public/animations/loading-2.json";

interface FullScreenGenerationLoadingProps {
  messages: string[];
  intervalMs?: number;
}

export function FullScreenGenerationLoading({
  messages,
  intervalMs = 3000,
}: FullScreenGenerationLoadingProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [messages.length, intervalMs]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F8F5]">
      <Lottie animationData={loadingAnimation} loop className="w-28" />
      <div className="mt-4 h-6">
        <p
          className={`text-sm text-zinc-400 transition-all duration-400 ${
            visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          {messages[index]}
        </p>
      </div>
    </div>
  );
}
