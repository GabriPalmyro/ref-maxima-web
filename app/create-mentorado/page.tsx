"use client";

import { ArrowLeft, TriangleAlert, User } from "lucide-react";
import { LottieSpinner } from "@/components/lottie-spinner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function CreateMentoradoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instagram: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const mentee = await api.post<{ id: string }>("/mentor/mentees", {
        name: formData.name,
        email: formData.email,
        instagram: formData.instagram || undefined,
        phone: formData.phone || undefined,
      });
      router.push(`/create-mentorado/presentation?menteeId=${mentee.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao criar mentorado"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center bg-[#F9F8F5] font-(family-name:--font-inter)">
      <button
        type="button"
        onClick={() => router.push("/home")}
        className="absolute left-8 top-8 z-10 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700"
      >
        <ArrowLeft className="size-4" />
        Voltar para dashboard
      </button>

      <div className="flex w-full max-w-[1400px] items-center justify-between gap-16 px-16">
        <div className="flex flex-1 items-center justify-center">
          <Image
            src="/images/mentorado/image.svg"
            alt="Ilustração"
            width={500}
            height={500}
            priority
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="w-[400px] rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-zinc-900">
                Informações
              </h1>
            </div>

            <div className="mb-6 flex justify-center">
              <div className="flex cursor-pointer flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
                  <User className="size-8 text-zinc-300" fill="currentColor" />
                </div>
                <span className="text-xs text-zinc-500 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-700">
                  Enviar foto
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-400" />
                <p className="text-sm leading-relaxed text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Nome do mentorado
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                />
              </div>

              <div>
                <label
                  htmlFor="instagram"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Instagram (opcional)
                </label>
                <input
                  type="text"
                  id="instagram"
                  placeholder="@usuario"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Telefone (opcional)
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="+55 11 99999-9999"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                />
              </div>

              <p className="text-xs text-zinc-500">
                Não se preocupe, você poderá editar todas essas informações em
                um segundo momento.
              </p>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <LottieSpinner size={16} />
                  ) : (
                    "Continuar"
                  )}
                </button>
              </div>
            </form>
          </div>

          <button
            type="button"
            onClick={() => router.push("/home")}
            className="mt-4 w-[400px] text-center text-sm text-zinc-500 hover:text-zinc-700"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
