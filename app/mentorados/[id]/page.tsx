"use client";

import {
  ArrowLeft,
  Check,
  FileDown,
  Megaphone,
  Trophy,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { Sidebar } from "@/components/sidebar";
import { ReportRenderer } from "@/components/report-renderer";
import { LottieLoading } from "@/components/lottie-loading";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { api } from "@/lib/api";
import { InstagramPhonePreview } from "@/components/instagram-phone-preview";

interface Mentee {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  instagram?: string;
  onboardingStatus: string;
  createdAt: string;
}

interface Report {
  id: string;
  type: string;
  status: string;
  title: string;
  rawResponse: string | null;
  structuredContent?: Record<string, unknown> | null;
  answers?: Record<string, string>;
  generatedAt: string;
}

interface InstagramDraftResponse {
  id: string;
  menteeId: string;
  fullName: string | null;
  biography: string | null;
  profilePicUrl: string | null;
  externalUrl: string | null;
  posts: Array<{ position: number; imageUrl: string; originalPostId?: string }>;
  updatedAt: string;
}

interface ReportCardConfig {
  type: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

const REPORT_CARDS: ReportCardConfig[] = [
  {
    type: "PERSONA_ICP",
    label: "Cliente Ideal",
    description: "Quem você escolhe ajudar.",
    icon: User,
  },
  {
    type: "POSICIONAMENTO",
    label: "Posicionamento",
    description: "Como você quer ser percebido.",
    icon: Trophy,
  },
  {
    type: "MENSAGEM_CLARA",
    label: "Mensagem Clara",
    description: "O que você comunica com clareza.",
    icon: Megaphone,
  },
];

const REPORT_LABELS: Record<string, string> = {
  PERSONA_ICP: "Persona Ideal - Estudo ICP",
  POSICIONAMENTO: "Posicionamento Estratégico",
  MENSAGEM_CLARA: "Mensagem Clara",
};

function getResumeUrl(onboardingStatus: string, menteeId: string): string | null {
  switch (onboardingStatus) {
    case "PENDING":
      return `/create-mentorado/form?round=1&menteeId=${menteeId}`;
    case "PHASE_1":
      return `/create-mentorado/headlines?menteeId=${menteeId}`;
    case "PHASE_2":
      return `/create-mentorado/form?round=3&menteeId=${menteeId}`;
    default:
      return null;
  }
}

export default function MenteeDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [mentee, setMentee] = useState<Mentee | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [instagramDraft, setInstagramDraft] = useState<InstagramDraftResponse | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [menteeData, reportsData, draftData] = await Promise.all([
          api.get<Mentee>(`/mentor/mentees/${id}`),
          api.get<Report[]>(`/mentor/mentees/${id}/reports`),
          api.get<InstagramDraftResponse>(`/mentor/mentees/${id}/instagram-draft`).catch(() => null),
        ]);
        setMentee(menteeData);
        setReports(reportsData);
        setInstagramDraft(draftData);
      } catch {
        router.push("/home");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, router]);

  const getReport = (type: string) =>
    reports.find((r) => r.type === type);

  const isCompleted = (type: string) => {
    const report = getReport(type);
    return report?.status === "COMPLETED";
  };

  // Extract the selected headline from POSICIONAMENTO answers
  const posReport = getReport("POSICIONAMENTO");
  const headline = posReport?.answers?.headline ?? null;

  const handleCardClick = (type: string) => {
    const report = getReport(type);
    if (report && report.status === "COMPLETED") {
      setSelectedReport(report);
    }
  };

  const handleNextReport = () => {
    if (!selectedReport) return;
    const currentIndex = REPORT_CARDS.findIndex(
      (c) => c.type === selectedReport.type
    );
    for (let i = currentIndex + 1; i < REPORT_CARDS.length; i++) {
      const next = getReport(REPORT_CARDS[i].type);
      if (next && next.status === "COMPLETED") {
        setSelectedReport(next);
        return;
      }
    }
    setSelectedReport(null);
  };

  const handlePrint = () => {
    if (!selectedReport?.rawResponse || !mentee) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>${REPORT_LABELS[selectedReport.type] ?? selectedReport.type} - ${mentee.name}</title>
      <style>body{font-family:Inter,sans-serif;padding:40px;line-height:1.6;color:#333}h1{font-size:20px;margin-bottom:8px}h2{font-size:14px;color:#666;margin-bottom:24px}pre{white-space:pre-wrap;font-family:Inter,sans-serif;font-size:14px}</style>
      </head><body>
      <h1>${REPORT_LABELS[selectedReport.type] ?? selectedReport.type}</h1>
      <h2>${mentee.name}</h2>
      <pre>${selectedReport.rawResponse}</pre>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (isLoading) {
    return (
      <div className="bg-[#FBFBFB]">
        <LottieLoading />
      </div>
    );
  }

  if (!mentee) return null;

  // Report preview overlay
  if (selectedReport) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center bg-[#F9F8F5] font-(family-name:--font-inter)">
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
          <button
            type="button"
            onClick={() => setSelectedReport(null)}
            className="text-zinc-400 transition-colors hover:text-zinc-600"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Card area */}
        <div className="flex min-h-0 w-full flex-1 flex-col items-center px-4 pb-10">
          <div
            className="relative flex min-h-0 w-full max-w-[1340px] flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)]"
          >
            {/* Card header */}
            <div className="flex h-[46px] shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-[21px]">
              <p className="text-[14px] font-medium leading-[17.568px] text-black">
                {REPORT_LABELS[selectedReport.type] ?? selectedReport.type}
              </p>
              <p className="text-[14px] font-medium leading-[17.568px] text-black">
                {mentee.name}
              </p>
              <button
                type="button"
                onClick={handlePrint}
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
                <Image
                  src="/images/asterisk.svg"
                  alt=""
                  width={310}
                  height={352}
                />
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
                {selectedReport.title}
              </h2>

              {/* Report content */}
              <ReportRenderer
                type={selectedReport.type}
                structuredContent={selectedReport.structuredContent}
                rawResponse={selectedReport.rawResponse}
                menteeName={mentee.name}
              />
            </div>

            {/* Bottom gradient overlay — fixed at card bottom regardless of scroll */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[84px] bg-gradient-to-t from-white to-transparent" />
          </div>

          {/* Actions below card */}
          <div className="mt-4 flex shrink-0 flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleNextReport}
              className="flex h-[32px] w-[269px] items-center justify-center overflow-hidden rounded-[4px] text-xs font-semibold text-white shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.06)]"
              style={{
                backgroundImage:
                  "linear-gradient(174.04deg, rgb(195, 111, 71) 18.49%, rgb(180, 71, 50) 51.66%, rgb(175, 83, 77) 129.12%)",
              }}
            >
              {REPORT_CARDS.findIndex(
                (c) => c.type === selectedReport.type
              ) ===
              REPORT_CARDS.length - 1
                ? "Fechar"
                : "Próximo"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="text-xs font-semibold text-[#71717a] underline"
            >
              Voltar para mentorado
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main view: sidebar + cards
  return (
    <div className="flex h-screen bg-[#FBFBFB] font-(family-name:--font-inter)">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-y-auto">
        {/* Back navigation */}
        <div className="px-8 pt-8">
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-700"
          >
            <ArrowLeft className="size-3" />
            Voltar para dashboard
          </button>
        </div>

        {/* Content area */}
        <div className="flex flex-1 gap-0 px-8">
          {/* Left ~80%: cards area */}
          <div className="flex flex-[4] flex-col items-center justify-center">
            {/* Headline */}
            {headline && (
              <p className="mx-auto mb-16 max-w-[465px] text-center text-base font-medium leading-snug text-[#212121]">
                {headline}
              </p>
            )}

            {/* Report cards */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-[30px]">
                {REPORT_CARDS.map((card) => {
                  const completed = isCompleted(card.type);
                  const Icon = card.icon;

                  return (
                    <button
                      key={card.type}
                      type="button"
                      onClick={() => handleCardClick(card.type)}
                      disabled={!completed}
                      className="group relative flex h-[170px] w-[230px] flex-col rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-[0px_2px_6px_-4px_#d3b892,0px_10px_38px_-3px_rgba(211,184,146,0.32)] transition-shadow hover:shadow-[0px_4px_12px_-4px_#d3b892,0px_16px_44px_-3px_rgba(211,184,146,0.36)] disabled:cursor-default disabled:opacity-60 disabled:hover:shadow-[0px_2px_6px_-4px_#d3b892,0px_10px_38px_-3px_rgba(211,184,146,0.32)]"
                    >
                      {/* Icon + Checkmark row */}
                      <div className="mb-auto flex w-full items-start justify-between">
                        <div className="flex size-10 items-center justify-center rounded-[7px] border border-zinc-200">
                          <Icon className="size-5 text-zinc-500" />
                        </div>
                        {completed && (
                          <div className="flex size-5 items-center justify-center rounded-full bg-[#AB926E]">
                            <Check className="size-2.5 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      {/* Title + Description */}
                      <div>
                        <p className="text-sm font-semibold capitalize tracking-tight text-[#55432A]">
                          {card.label}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-zinc-500">
                          {card.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Resume button */}
              {(() => {
                const resumeUrl = getResumeUrl(mentee.onboardingStatus, mentee.id);
                if (!resumeUrl) return null;
                return (
                  <button
                    type="button"
                    onClick={() => router.push(resumeUrl)}
                    className="flex h-[32px] w-[269px] items-center justify-center overflow-hidden rounded-[4px] text-xs font-semibold text-white shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.06)]"
                    style={{
                      backgroundImage:
                        "linear-gradient(174.04deg, rgb(195, 111, 71) 18.49%, rgb(180, 71, 50) 51.66%, rgb(175, 83, 77) 129.12%)",
                    }}
                  >
                    Continuar preenchimento
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Right ~20%: Instagram preview stuck to the right */}
          {instagramDraft && (
            <div className="flex flex-1 items-center justify-end">
              <InstagramPhonePreview
                fullName={instagramDraft.fullName}
                biography={instagramDraft.biography}
                profilePicUrl={instagramDraft.profilePicUrl}
                externalUrl={instagramDraft.externalUrl}
                posts={instagramDraft.posts}
                updatedAt={instagramDraft.updatedAt}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
