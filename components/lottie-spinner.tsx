"use client";

import Lottie from "lottie-react";
import animationData from "@/public/animations/loading-2.json";

interface LottieSpinnerProps {
  size?: number;
}

export function LottieSpinner({ size = 20 }: LottieSpinnerProps) {
  return (
    <Lottie
      animationData={animationData}
      loop
      style={{ width: size, height: size }}
    />
  );
}
