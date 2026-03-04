"use client";

import Lottie from "lottie-react";
import animationData from "@/public/animations/loading-1.json";

interface LottieLoadingProps {
  message?: string;
}

export function LottieLoading({ message }: LottieLoadingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Lottie animationData={animationData} loop className="w-40" />
      {message && <p className="mt-4 text-sm text-zinc-500">{message}</p>}
    </div>
  );
}
