"use client";

import Image from "next/image";
import {
  LifeBuoy,
  Users,
  Video,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const { mentor, logout } = useAuth();
  const router = useRouter();

  return (
    <aside className="flex h-screen w-[264px] shrink-0 flex-col bg-white px-6 py-8">
      <div className="mb-16">
        <Image
          src="/images/logo.svg"
          alt="Referência Máxima"
          width={150}
          height={32}
          priority
        />
      </div>

      <button
        type="button"
        onClick={() => router.push("/perfil")}
        className="mb-12 flex w-full items-center gap-3 rounded-lg p-1 transition-colors hover:bg-zinc-50"
      >
        <div className="relative h-[25px] w-[25px] overflow-hidden rounded-lg bg-zinc-100">
          {mentor?.avatarUrl && (
            <Image
              src={mentor.avatarUrl}
              alt={mentor.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-left text-base font-medium text-zinc-900">
            {mentor?.name ?? "Carregando..."}
          </p>
        </div>
      </button>

      <nav className="space-y-2">
        <p className="mb-4 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Gestão
        </p>
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-zinc-900"
        >
          <Users className="size-[18px]" strokeWidth={2} />
          Mentorados
        </button>
        <span className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-900 opacity-30">
          <Video className="size-[18px]" strokeWidth={2} />
          Conteúdos
        </span>
      </nav>

      <div className="flex-1" />

      <div className="space-y-3">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 text-sm text-zinc-500 transition-colors hover:text-zinc-700"
        >
          <LifeBuoy className="size-[18px]" strokeWidth={1.5} />
          Ajuda & Suporte
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2.5 text-sm text-zinc-400 transition-colors hover:text-red-500"
        >
          <LogOut className="size-[18px]" strokeWidth={1.5} />
          Sair
        </button>
      </div>
    </aside>
  );
}
