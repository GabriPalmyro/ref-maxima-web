"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LottieLoading } from "@/components/lottie-loading";

const steps = [
  { src: "/images/mentorado/step-1.png", alt: "Passo 1 — Construir o seu cliente ideal" },
  { src: "/images/mentorado/step-2.png", alt: "Passo 2 — Criar o seu posicionamento" },
  { src: "/images/mentorado/step-3.png", alt: "Passo 3 — Clarificar a sua mensagem" },
];

// Timeline (7s total):
// 0ms     Card 1
// 1100ms  Dot 0-0 → 1300ms Dot 0-1 → 1500ms Dot 0-2
// 2200ms  Card 2
// 3300ms  Dot 1-0 → 3500ms Dot 1-1 → 3700ms Dot 1-2
// 4400ms  Card 3
// 7000ms  Button
const CARD_DELAYS = [0, 2200, 4400];
const DOT_DELAYS: Record<string, number> = {
  "0-0": 1100, "0-1": 1300, "0-2": 1500,
  "1-0": 3300, "1-1": 3500, "1-2": 3700,
};
const BUTTON_DELAY = 7000;

function AnimatedDots({ groupIndex, visibleDots }: { groupIndex: number; visibleDots: Set<string> }) {
  return (
    <div className="flex shrink-0 items-center gap-[4px]">
      {[0, 1, 2].map((dotIndex) => (
        <div
          key={dotIndex}
          className={`size-[7px] rounded-full bg-[#E8DDCE] transition-all duration-300 ease-out ${
            visibleDots.has(`${groupIndex}-${dotIndex}`)
              ? "scale-100 opacity-100"
              : "scale-0 opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

function PresentationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menteeId = searchParams.get("menteeId") ?? "";

  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [visibleDots, setVisibleDots] = useState<Set<string>>(new Set());
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    CARD_DELAYS.forEach((delay, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleCards((prev) => new Set(prev).add(index));
        }, delay)
      );
    });

    for (const [key, delay] of Object.entries(DOT_DELAYS)) {
      timers.push(
        setTimeout(() => {
          setVisibleDots((prev) => new Set(prev).add(key));
        }, delay)
      );
    }

    timers.push(
      setTimeout(() => setShowButton(true), BUTTON_DELAY)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStart = () => {
    router.push(`/create-mentorado/form?round=1&menteeId=${menteeId}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f9f8f5] font-(family-name:--font-inter)">
      {/* Header */}
      <div className="flex items-center justify-between px-[52px] py-8">
        <Image
          src="/images/logo.svg"
          alt="Referência Máxima"
          width={160}
          height={14}
          priority
        />
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-600"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center px-6">
        {/* Title */}
        <div className="mt-4 text-center">
          <h1 className="text-[32px] font-medium leading-[40px] tracking-[-0.64px] text-[#71717a]">
            Construa sua relevância para
            <br />
            quem{" "}
            <span className="text-[#d3b892]">realmente importa.</span>
          </h1>
          <div className="mt-1 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mentorado/scratch.svg"
              alt=""
              width={266}
              height={19}
            />
          </div>
        </div>

        {/* Step Cards */}
        <div className="mt-10 flex items-center gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-6">
              {/* Card */}
              <div
                className={`transition-all duration-500 ease-out ${
                  visibleCards.has(index)
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.src}
                  alt={step.alt}
                  className="h-[420px] w-[267px] shrink-0 object-contain"
                />
              </div>

              {/* Animated dots between cards */}
              {index < steps.length - 1 && (
                <AnimatedDots groupIndex={index} visibleDots={visibleDots} />
              )}
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-12 mb-10 flex justify-center">
          <button
            type="button"
            onClick={handleStart}
            disabled={!showButton}
            className={`h-[32px] w-[269px] rounded-[4px] text-xs font-semibold text-white shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C36F47] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f8f5] ${
              showButton
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0"
            }`}
            style={{
              backgroundImage:
                "linear-gradient(174deg, rgb(195, 111, 71) 18.49%, rgb(180, 71, 50) 51.66%, rgb(175, 83, 77) 129.12%)",
            }}
          >
            Começar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PresentationPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#f9f8f5]">
          <LottieLoading />
        </div>
      }
    >
      <PresentationContent />
    </Suspense>
  );
}
