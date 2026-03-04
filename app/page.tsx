"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LottieSpinner } from "@/components/lottie-spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { useGoogleLogin } from "@react-oauth/google";

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const data = await api.post<{ accessToken: string }>(
        "/auth/mentor/login",
        { email, password }
      );
      await login(data.accessToken);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken: string) => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const data = await api.post<{ accessToken: string }>(
        "/auth/mentor/google",
        { accessToken }
      );
      await login(data.accessToken);
      router.push("/home");
    } catch (err) {
      if (err instanceof Error && err.message.includes("403")) {
        setError(
          "Este e-mail Google não está cadastrado como mentor. Faça o cadastro primeiro."
        );
      } else {
        setError("Erro ao conectar com Google. Tente novamente.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) =>
      handleGoogleSuccess(tokenResponse.access_token),
    onError: () =>
      setError("Erro ao conectar com Google. Tente novamente."),
  });

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
        <div className="min-w-[381px] min-h-[367px] rounded-lg border border-zinc-200 bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-6">
            <h1 className="mb-1 text-[22px] font-semibold text-[#3F3F46]">
              Entrar
            </h1>
            <p className="text-[14px] font-medium text-zinc-500">
              Não possui conta? Realizar{" "}
              <a href="/register" className="text-[#ABA56E] hover:underline">
                cadastro
              </a>
              .
            </p>
          </div>

          {/* Google Button (styled) */}
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={() => googleLogin()}
            className="mb-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded bg-zinc-50 px-4 py-3 text-sm font-medium text-[#3F3F46] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <LottieSpinner size={16} />
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4" />
                <path d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853" />
                <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54755 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05" />
                <path d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335" />
              </svg>
            )}
            Entrar com Google
          </button>

          {/* Divider */}
          <div className="mb-6 text-center">
            <span className="text-[12px] font-medium text-zinc-500">
              Ou usando email e senha
            </span>
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
                  Entrar
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
