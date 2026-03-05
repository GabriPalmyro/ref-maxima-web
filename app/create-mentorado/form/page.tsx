"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { LottieLoading } from "@/components/lottie-loading";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { api } from "@/lib/api";

const REPORT_TYPES: Record<number, string> = {
  1: "PERSONA_ICP",
  2: "POSICIONAMENTO",
  3: "MENSAGEM_CLARA",
};

const questionsByRound: Record<number, string[]> = {
  1: [
    "Quem você quer atrair como cliente?",
    "Qual principal problema você resolve?",
    "Qual é a transformação que você promete?",
    "Por que você tem autoridade para ajudar essa pessoa?",
    "Quais são os 3 pilares do seu método?",
  ],
  3: [
    "Qual o momento mais difícil que você viveu antes de dominar o seu método?",
  ],
};

function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const round = Number(searchParams.get("round") ?? "1") as 1 | 2 | 3;
  const menteeId = searchParams.get("menteeId") ?? "";

  // Round 2 is the headline picker — redirect there
  if (round === 2) {
    router.push(`/create-mentorado/headlines?menteeId=${menteeId}`);
    return null;
  }

  const questions = questionsByRound[round] ?? questionsByRound[1];

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  );

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      let answersMap: Record<string, string>;

      if (round === 1) {
        answersMap = {};
        questions.forEach((_q, i) => {
          answersMap[`q${i + 1}`] = answers[i];
        });
      } else {
        // Round 3 — single question
        answersMap = { momento_dificil: answers[0] };
      }

      // Fire and forget — redirect immediately
      api
        .post(`/mentor/mentees/${menteeId}/reports/generate`, {
          type: REPORT_TYPES[round],
          answers: answersMap,
        })
        .catch(() => {});

      router.push(
        `/create-mentorado/result?round=${round}&menteeId=${menteeId}&generating=true`
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else if (round === 3) {
      router.push(
        `/create-mentorado/result?round=2&menteeId=${menteeId}`
      );
    } else {
      router.push(`/create-mentorado/presentation?menteeId=${menteeId}`);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F9F8F5] font-(family-name:--font-inter) p-8">
      <div className="absolute left-8 top-8 z-10 hidden md:flex">
        <Image src="/images/logo.svg" alt="Referência Máxima" width={166} height={17} priority />
      </div>

      <button
        type="button"
        onClick={handleBack}
        className="absolute left-8 top-20 z-10 flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-700 md:top-24"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </button>

      <div className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between pb-8 mt-20 md:mt-12">
        <div className="flex flex-1 flex-col items-center justify-center w-full px-4 md:px-0">
          <h1
            key={`title-${currentStep}`}
            className="mb-8 animate-fade-in-up text-2xl font-medium tracking-tight text-zinc-900 md:text-[32px] text-center"
          >
            {questions.length > 1 && `${currentStep + 1}. `}{questions[currentStep]}
          </h1>

          <div
            key={`textarea-${currentStep}`}
            className="mx-auto w-full max-w-3xl animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <textarea
              value={answers[currentStep]}
              onChange={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
                const newAnswers = [...answers];
                newAnswers[currentStep] = e.target.value;
                setAnswers(newAnswers);
              }}
              placeholder="Descreva aqui..."
              className="block w-full min-h-64 max-h-[60vh] resize-none overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 leading-relaxed text-zinc-800 shadow-sm placeholder:text-zinc-500 focus-visible:border-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 md:max-h-[65vh]"
              rows={4}
            />
          </div>
        </div>

        <div className="flex w-full justify-center pt-10">
          <button
            onClick={handleNext}
            disabled={!answers[currentStep].trim()}
            className="flex w-full max-w-[320px] items-center justify-center rounded-lg bg-[#C15C3D] py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#a64e32] disabled:opacity-50 disabled:hover:bg-[#C15C3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C15C3D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F8F5]"
          >
            {currentStep === questions.length - 1 ? "Finalizar" : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F9F8F5]">
          <LottieLoading />
        </div>
      }
    >
      <FormContent />
    </Suspense>
  );
}
