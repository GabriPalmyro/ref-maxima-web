"use client";

import { ArrowLeft, RefreshCw } from "lucide-react";
import { LottieLoading } from "@/components/lottie-loading";
import { FullScreenGenerationLoading } from "@/components/fullscreen-generation-loading";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api } from "@/lib/api";

function HeadlinesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menteeId = searchParams.get("menteeId") ?? "";

  const [headlines, setHeadlines] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeadlines = async (regenerate = false) => {
    if (!menteeId) {
      router.push("/create-mentorado");
      return;
    }
    try {
      const data = await api.post<{ headlines: string[] }>(
        `/mentor/mentees/${menteeId}/headlines/generate`,
        { regenerate }
      );
      setHeadlines(data.headlines);
      setSelected(null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao gerar headlines"
      );
    }
  };

  useEffect(() => {
    fetchHeadlines().finally(() => setIsLoading(false));
  }, [menteeId]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await fetchHeadlines(true);
    setIsRegenerating(false);
  };

  const handleNext = () => {
    if (selected === null) return;

    // Fire and forget — redirect immediately
    api
      .post(`/mentor/mentees/${menteeId}/reports/generate`, {
        type: "POSICIONAMENTO",
        answers: { headline: headlines[selected] },
      })
      .catch(() => {});

    router.push(
      `/create-mentorado/result?round=2&menteeId=${menteeId}&generating=true`
    );
  };

  const handleBack = () => {
    router.push(`/create-mentorado/result?round=1&menteeId=${menteeId}`);
  };

  if (isLoading) {
    return (
      <FullScreenGenerationLoading
        messages={[
          "Analisando o posicionamento...",
          "Criando headlines estratégicas...",
          "Refinando a comunicação...",
          "Testando variações...",
          "Finalizando as headlines...",
        ]}
      />
    );
  }

  if (isRegenerating) {
    return (
      <FullScreenGenerationLoading
        messages={[
          "Regenerando headlines...",
          "Criando novas variações...",
          "Refinando a comunicação...",
          "Finalizando as headlines...",
        ]}
      />
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F9F8F5] font-(family-name:--font-inter) p-8">
      <div className="absolute left-8 top-8 z-10 hidden items-center gap-1.5 font-semibold tracking-tight text-zinc-800 md:flex">
        Referência Máxima <span className="text-xl leading-none">✻</span>
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
        <div className="mt-12 w-full px-4 text-center md:px-0">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <h1 className="mb-2 animate-fade-in-up text-2xl font-medium tracking-tight text-zinc-900 md:text-[32px]">
            Qual frase combina mais com você?
          </h1>
          <p className="mb-4 text-sm text-zinc-500">
            Escolha a headline que melhor representa o seu posicionamento
          </p>

          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-800 disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${isRegenerating ? "animate-spin" : ""}`} />
            {isRegenerating ? "Gerando novas headlines..." : "Refazer Headlines"}
          </button>

          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
            {headlines.map((headline, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelected(index)}
                disabled={isRegenerating}
                className={`w-full rounded-xl border-2 px-6 py-4 text-left text-sm leading-relaxed transition-all ${
                  selected === index
                    ? "border-[#C15C3D] bg-white shadow-md text-zinc-900"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:shadow-sm"
                } disabled:opacity-50`}
              >
                {headline}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto flex w-full justify-center pt-10">
          <button
            onClick={handleNext}
            disabled={selected === null || isRegenerating}
            className="flex w-full max-w-[320px] items-center justify-center rounded-lg bg-[#C15C3D] py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#a64e32] disabled:opacity-50 disabled:hover:bg-[#C15C3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C15C3D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F8F5]"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HeadlinesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F9F8F5]">
          <LottieLoading />
        </div>
      }
    >
      <HeadlinesContent />
    </Suspense>
  );
}
