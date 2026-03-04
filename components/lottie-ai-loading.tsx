"use client";

import Lottie from "lottie-react";
import animationData from "@/public/animations/loading-3.json";

interface LottieAiLoadingProps {
  message?: string;
  className?: string;
  size?: string;
}

export function LottieAiLoading({ message, className, size }: LottieAiLoadingProps) {
  return (
    <div className={className ?? "flex min-h-screen flex-col items-center justify-center"}>
      <Lottie animationData={animationData} loop className={size ?? "w-24"} />
      {message && <p className="mt-4 text-sm text-zinc-500">{message}</p>}
    </div>
  );
}
