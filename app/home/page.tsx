"use client";

import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { LottieSpinner } from "@/components/lottie-spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Mentee {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  instagram?: string;
  onboardingStatus: string;
  createdAt: string;
}

interface InviteCode {
  id: string;
  code: string;
  status: string;
  menteeName?: string;
  menteeEmail?: string;
  forMenteeId?: string;
  expiresAt?: string;
}

function getStatusBadge(status: string) {
  if (status === "COMPLETED") {
    return { label: "Finalizado", className: "bg-[#f3f3f4] text-[#3f3f46]" };
  }
  return { label: "Em andamento", className: "bg-[#f6f6f0] text-[#949415]" };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleDateString("pt-BR", { month: "long" }).toUpperCase();
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

export default function HomePage() {
  const router = useRouter();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [invites, setInvites] = useState<InviteCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"status" | "date" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function load() {
      try {
        const [menteesData, invitesData] = await Promise.all([
          api.get<Mentee[]>("/mentor/mentees"),
          api.get<InviteCode[]>("/invites"),
        ]);
        setMentees(menteesData);
        setInvites(invitesData);
      } catch {
        // 401 handled by api client (redirects to /)
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir ${name}?\n\nTodos os relatórios e dados desse mentorado serão apagados permanentemente.`
      )
    )
      return;
    try {
      await api.delete(`/mentor/mentees/${id}`);
      setMentees((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Erro ao excluir mentorado.");
    }
  };

  const getInvite = (mentee: Mentee): InviteCode | undefined =>
    invites.find(
      (inv) => inv.forMenteeId === mentee.id && inv.status === "ACTIVE"
    );

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      alert("Não foi possível copiar o código.");
    }
  };

  const completedCount = mentees.filter(
    (m) => m.onboardingStatus === "COMPLETED"
  ).length;

  const toggleSort = (col: "status" | "date") => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir(col === "date" ? "desc" : "asc");
    }
  };

  const filteredMentees = mentees
    .filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        (m.instagram?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "status") {
        const aCompleted = a.onboardingStatus === "COMPLETED" ? 1 : 0;
        const bCompleted = b.onboardingStatus === "COMPLETED" ? 1 : 0;
        return (aCompleted - bCompleted) * dir;
      }
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    });

  return (
    <div className="flex h-screen bg-[#FBFBFB] font-(family-name:--font-inter)">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 pr-20">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-semibold text-zinc-900">
              Seja bem-vindo.
            </h1>
            <p className="text-sm text-zinc-500">
              Faça a gestão de seus mentorados por aqui
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/create-mentorado")}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow hover:bg-zinc-50"
          >
            Novo mentorado
            <span className="mx-1 h-4 w-px bg-zinc-200" />
            <Plus className="size-4" />
          </button>
        </div>

        {/* Banner card */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white shadow-[0px_4px_6px_-1px_rgba(5,5,5,0.1),0px_2px_4px_-1px_rgba(0,0,0,0.06)]" style={{ height: 134 }}>
          <div className="flex flex-col gap-2 px-6">
            <p className="text-[16px] font-semibold text-zinc-900">
              Referência Máxima
            </p>
            <p className="text-[12px] text-zinc-500">
              Conheça o tutorial completo da plataforma.
            </p>
            <button
              type="button"
              className="mt-1 w-fit rounded-md bg-white px-3 py-1.5 text-[12px] font-medium text-zinc-700 shadow hover:bg-zinc-50"
            >
              Assistir tutorial
            </button>
          </div>
          <div className="relative h-[134px] w-[200px] shrink-0">
            <Image
              src="/images/home/person.svg"
              alt=""
              fill
              className="object-contain object-right-bottom"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 rounded-lg border border-zinc-100 bg-white px-6 py-4 shadow-sm">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <p className="mb-1 text-sm text-zinc-500">Mentorados ativos</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-semibold text-zinc-900">
                  {mentees.length}
                </p>
                <p className="mb-0.5 flex items-center gap-1 text-[12px] text-zinc-400">
                  <TrendingUp className="size-3" />
                  5%
                </p>
              </div>
            </div>
            <div>
              <p className="mb-1 text-sm text-zinc-500">Perfis finalizados</p>
              <p className="text-2xl font-semibold text-zinc-900">
                {completedCount}
              </p>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-sm text-zinc-500">Convites enviados</p>
                <Image src="/images/home/graph.svg" alt="" width={40} height={16} />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-semibold text-zinc-900">
                  {invites.length}
                </p>
                <p className="mb-0.5 flex items-center gap-1 text-[12px] text-zinc-400">
                  <TrendingUp className="size-3" />
                  0%
                </p>
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-sm text-zinc-500">Conteúdos criados</p>
                <Image src="/images/home/graph.svg" alt="" width={40} height={16} />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-semibold text-zinc-900">0.00</p>
                <p className="mb-0.5 flex items-center gap-1 text-[12px] text-zinc-400">
                  <TrendingUp className="size-3" />
                  0%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4 w-full max-w-[280px]">
          <input
            type="text"
            placeholder="Pesquise aqui..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[35px] w-full rounded-[6px] bg-white px-4 pl-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
          />
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_0.8fr] gap-4 border-b border-zinc-100 px-6 py-4">
            <p className="text-[10px] font-semibold uppercase text-[#18181b] opacity-50">
              Mentorado
            </p>
            <p className="text-[10px] font-semibold uppercase text-[#18181b] opacity-50">
              @Usuário / Instagram
            </p>
            <p className="text-[10px] font-semibold uppercase text-[#18181b] opacity-50">
              Código de convite
            </p>
            <button
              type="button"
              onClick={() => toggleSort("status")}
              className="flex items-center gap-1"
            >
              <p className="text-[10px] font-semibold uppercase text-[#18181b] opacity-50">
                Status
              </p>
              {sortBy === "status" && sortDir === "asc" ? (
                <ChevronUp className="size-3 text-zinc-600" />
              ) : (
                <ChevronDown className={`size-3 ${sortBy === "status" ? "text-zinc-600" : "text-zinc-400"}`} />
              )}
            </button>
            <button
              type="button"
              onClick={() => toggleSort("date")}
              className="flex items-center gap-1"
            >
              <p className="text-[10px] font-semibold uppercase text-[#18181b] opacity-50">
                Iniciado em
              </p>
              {sortBy === "date" && sortDir === "asc" ? (
                <ChevronUp className="size-3 text-zinc-600" />
              ) : (
                <ChevronDown className={`size-3 ${sortBy === "date" ? "text-zinc-600" : "text-zinc-400"}`} />
              )}
            </button>
            <p className="text-[10px] font-semibold uppercase text-[#18181b] opacity-50">
              Ações
            </p>
          </div>

          <div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LottieSpinner size={24} />
              </div>
            ) : filteredMentees.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-400">
                {search
                  ? "Nenhum mentorado encontrado."
                  : 'Nenhum mentorado cadastrado. Clique em "Novo mentorado" para começar.'}
              </div>
            ) : (
              filteredMentees.map((mentee, index) => {
                const invite = getInvite(mentee);
                const badge = getStatusBadge(mentee.onboardingStatus);
                return (
                  <div
                    key={mentee.id}
                    className={`grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_0.8fr] gap-4 px-6 py-3 ${
                      index % 2 === 0 ? "bg-white" : "bg-[#fbfbfb]"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="relative size-[19.5px] shrink-0 overflow-hidden rounded-full bg-zinc-100 flex items-center justify-center text-[8px] font-semibold text-zinc-500">
                        {mentee.avatarUrl ? (
                          <Image
                            src={mentee.avatarUrl}
                            alt={mentee.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          mentee.name[0]
                        )}
                      </div>
                      <p className="truncate text-[12px] font-semibold text-[#71717a]">
                        {mentee.name}
                      </p>
                    </div>
                    <p className="flex items-center text-[12px] font-semibold text-[#71717a]">
                      {mentee.instagram ? `@${mentee.instagram.replace(/^@/, "")}` : mentee.email}
                    </p>
                    <div className="flex items-center gap-1">
                      {invite ? (
                        <>
                          <span className="font-mono text-[10px] font-semibold text-[#71717a]">
                            {invite.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(invite.code)}
                            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                            title="Copiar código"
                          >
                            <Copy className="size-3" />
                          </button>
                          {copiedCode === invite.code && (
                            <span className="text-[10px] text-green-600">Copiado!</span>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] text-zinc-400">—</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex rounded-[20px] px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="flex items-center text-[10px] font-semibold uppercase text-[#71717a]">
                      {formatDate(mentee.createdAt)}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Visualizar"
                        onClick={() =>
                          router.push(`/mentorados/${mentee.id}`)
                        }
                        className="text-zinc-500 hover:text-zinc-700"
                      >
                        <Eye className="size-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Excluir"
                        onClick={() => handleDelete(mentee.id, mentee.name)}
                        className="text-zinc-500 hover:text-zinc-700"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
