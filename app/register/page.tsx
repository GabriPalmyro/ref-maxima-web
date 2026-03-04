"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LottieSpinner } from "@/components/lottie-spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const data = await api.post<{ accessToken: string }>(
        "/auth/mentor/register",
        { name, email, password }
      );
      await login(data.accessToken);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBFB] font-(family-name:--font-inter)">
      {/* Logo */}
      <div className="p-8">
        <Image
          src="/images/logo.svg"
          alt="Referência Máxima"
          width={150}
          height={32}
          priority
        />
      </div>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="min-w-[381px] rounded-lg border border-zinc-200 bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-6">
            <h1 className="mb-1 text-[22px] font-semibold text-[#3F3F46]">
              Criar conta
            </h1>
            <p className="text-[14px] font-medium text-zinc-500">
              Já possui conta?{" "}
              <a href="/" className="text-[#ABA56E] hover:underline">
                Entrar
              </a>
              .
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-[12px] font-medium text-zinc-700"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ABA56E]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[12px] font-medium text-zinc-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ABA56E]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[12px] font-medium text-zinc-700"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••••••"
                required
                minLength={6}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ABA56E]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-[#71717A] transition-colors drop-shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#71717A] focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <LottieSpinner size={16} />
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
