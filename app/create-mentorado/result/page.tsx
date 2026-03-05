"use client";

import { Copy, FileDown } from "lucide-react";
import Image from "next/image";
import { FullScreenGenerationLoading } from "@/components/fullscreen-generation-loading";
import { LottieLoading } from "@/components/lottie-loading";
import { ReportRenderer } from "@/components/report-renderer";
import { TypewriterText } from "@/components/typewriter-text";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

interface Report {
  id: string;
  type: string;
  status: string;
  title: string;
  rawResponse: string | null;
  structuredContent?: Record<string, unknown> | null;
  generatedAt: string;
}

interface InviteCode {
  id: string;
  code: string;
  status: string;
  menteeEmail?: string;
  forMenteeId?: string;
}

const ROUND_LABELS: Record<number, string> = {
  1: "Persona Ideal - Estudo ICP",
  2: "Posicionamento Estratégico",
  3: "Mensagem Clara",
};

const ROUND_TYPE: Record<number, string> = {
  1: "PERSONA_ICP",
  2: "POSICIONAMENTO",
  3: "MENSAGEM_CLARA",
};

const POLL_INTERVAL = 2000;
const POLL_TIMEOUT = 120000;

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const round = Number(searchParams.get("round") ?? "1");
  const menteeId = searchParams.get("menteeId") ?? "";
  const generating = searchParams.get("generating") === "true";

  const [report, setReport] = useState<Report | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [pollError, setPollError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollStartRef = useRef<number>(0);

  const fetchInviteCode = useCallback(async () => {
    try {
      const invites = await api.get<InviteCode[]>("/invites");
      const existing = invites.find(
        (i) => i.forMenteeId === menteeId && i.status === "ACTIVE"
      );
      if (existing) setInviteCode(existing.code);
    } catch {
      // ignore
    }
  }, [menteeId]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    if (!isPolling || !menteeId) return;

    pollStartRef.current = Date.now();

    const poll = async () => {
      if (Date.now() - pollStartRef.current > POLL_TIMEOUT) {
        stopPolling();
        setPollError("A geração está demorando mais que o esperado. Tente recarregar a página.");
        return;
      }

      try {
        const reports = await api.get<Report[]>(`/mentor/mentees/${menteeId}/reports`);
        const found = reports.find((r) => r.type === ROUND_TYPE[round]);

        if (found && found.status === "COMPLETED") {
          setReport(found);
          if (generating) setShowTypewriter(true);
          stopPolling();
          if (round === 3) fetchInviteCode();
        } else if (found && found.status === "ERROR") {
          setReport(found);
          stopPolling();
        }
      } catch {
        // keep polling on network errors
      }
    };

    poll();
    pollTimerRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [isPolling, menteeId, round, stopPolling, fetchInviteCode]);

  useEffect(() => {
    async function load() {
      if (!menteeId) {
        router.push("/create-mentorado");
        return;
      }
      try {
        const reports = await api.get<Report[]>(`/mentor/mentees/${menteeId}/reports`);
        const found = reports.find((r) => r.type === ROUND_TYPE[round]);

        if (found && found.status === "COMPLETED") {
          setReport(found);
          if (round === 3) fetchInviteCode();
        } else if (generating) {
          setIsPolling(true);
        } else if (found) {
          setReport(found);
        }
      } catch {
        // handled by api client
      } finally {
        setIsInitialLoading(false);
      }
    }
    load();
  }, [menteeId, round, router, generating, fetchInviteCode]);

  const handleCopy = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    if (round === 1) {
      router.push(`/create-mentorado/headlines?menteeId=${menteeId}`);
    } else if (round === 2) {
      router.push(`/create-mentorado/form?round=3&menteeId=${menteeId}`);
    } else {
      router.push("/home");
    }
  };

  const handleCorrect = () => {
    if (round === 2) {
      router.push(`/create-mentorado/headlines?menteeId=${menteeId}`);
    } else {
      router.push(`/create-mentorado/form?round=${round}&menteeId=${menteeId}`);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="bg-[#F9F8F5]">
        <LottieLoading />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center overflow-hidden bg-[#F9F8F5] font-(family-name:--font-inter)">
      {/* Top bar */}
      <div className="relative flex w-full shrink-0 items-center justify-between px-10 py-5">
        <Image
          src="/images/logo.svg"
          alt="Referência Máxima"
          width={166}
          height={17}
          priority
        />
        <span className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold uppercase text-[#a0a0a9]">
          PREVIEW
        </span>
        {/* spacer to balance the logo */}
        <span className="w-[166px]" />
      </div>

      {/* Card area */}
      <div className="flex min-h-0 w-full flex-1 flex-col items-center px-4 pb-6">

        {/* ── Polling state ── */}
        {isPolling && (
          <FullScreenGenerationLoading
            messages={[
              "Analisando as respostas...",
              "Construindo o perfil estratégico...",
              "Identificando padrões comportamentais...",
              "Mapeando desejos e dores...",
              "Gerando diagnóstico profundo...",
              "Estruturando o posicionamento...",
              "Finalizando o documento...",
            ]}
          />
        )}

        {/* ── Poll error state ── */}
        {pollError && (
          <div
            className="relative flex w-full max-w-[1340px] flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)]"
          >
            <div className="flex h-[46px] shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-[21px]">
              <p className="text-[14px] font-medium text-black">{ROUND_LABELS[round]}</p>
              <p className="text-[14px] font-medium text-red-600">Erro</p>
              <span className="w-5" />
            </div>
            <div className="flex flex-1 items-center justify-center px-[89px]">
              <p className="text-sm text-red-600">{pollError}</p>
            </div>
          </div>
        )}

        {/* ── Report completed ── */}
        {report && (
          <div
            className={`relative flex min-h-0 w-full max-w-[1340px] flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)]${
              generating ? " animate-fade-in-up" : ""
            }`}
          >
            {/* Card header */}
            <div className="flex h-[46px] shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-[21px]">
              <p className="text-[14px] font-medium leading-[17.568px] text-black">
                {ROUND_LABELS[round]}
              </p>
              <p className="text-[14px] font-medium leading-[17.568px] text-black">
                {report.status === "ERROR" ? (
                  <span className="text-red-600">Erro na geração</span>
                ) : null}
              </p>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-zinc-400 transition-colors hover:text-zinc-600"
                aria-label="Exportar"
              >
                <FileDown className="size-5" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="relative flex-1 overflow-y-auto px-[89px] pb-[100px] pt-[96px]">
              {/* Large background watermark */}
              <div className="pointer-events-none absolute -right-16 top-[133px] select-none opacity-[0.06]">
                <Image src="/images/asterisk.svg" alt="" width={310} height={352} />
              </div>

              {/* Small asterisk icon before title */}
              <Image
                src="/images/asterisk.svg"
                alt=""
                width={33}
                height={37}
                className="mb-[11px]"
              />

              {/* Title */}
              <h2 className="mb-[25px] text-[24px] font-medium leading-tight text-black">
                {report.title}
              </h2>

              {/* Report content */}
              {showTypewriter && !typewriterComplete ? (
                <TypewriterText
                  text={report.rawResponse ?? ""}
                  speed={5}
                  onComplete={() => setTypewriterComplete(true)}
                />
              ) : (
                <ReportRenderer
                  type={report.type}
                  structuredContent={report.structuredContent}
                  rawResponse={report.rawResponse}
                />
              )}
            </div>

            {/* Bottom gradient overlay */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[84px] bg-gradient-to-t from-white to-transparent" />
          </div>
        )}

        {/* Invite code — round 3 only */}
        {round === 3 && !isPolling && !pollError && report && (
          <div className="mt-4 flex w-full max-w-[1340px] shrink-0 items-center gap-3 rounded-lg border border-zinc-200 bg-white px-6 py-4 shadow-sm">
            <span className="text-sm font-medium text-zinc-500">Código de convite:</span>
            {inviteCode ? (
              <>
                <span className="flex-1 rounded-md bg-zinc-50 px-4 py-2 text-center font-mono text-lg font-bold tracking-widest text-zinc-800">
                  {inviteCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(174.04deg, rgb(195, 111, 71) 18.49%, rgb(180, 71, 50) 51.66%, rgb(175, 83, 77) 129.12%)",
                  }}
                >
                  <Copy className="size-4" />
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </>
            ) : (
              <span className="text-sm text-zinc-400">Gerando código...</span>
            )}
          </div>
        )}

        {/* Actions */}
        {!isPolling && !pollError && (!showTypewriter || typewriterComplete) && (
          <div className="mt-4 flex shrink-0 flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleNext}
              className="flex h-[32px] w-[269px] items-center justify-center overflow-hidden rounded-[4px] text-xs font-semibold text-white shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.06)]"
              style={{
                backgroundImage:
                  "linear-gradient(174.04deg, rgb(195, 111, 71) 18.49%, rgb(180, 71, 50) 51.66%, rgb(175, 83, 77) 129.12%)",
              }}
            >
              {round === 3 ? "Concluir" : "Próximo"}
            </button>
            <button
              type="button"
              onClick={handleCorrect}
              className="text-xs font-semibold text-[#71717a] underline"
            >
              Corrigir alguma informação
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F9F8F5]">
          <LottieLoading />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
