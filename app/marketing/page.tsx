import Image from "next/image";
import Link from "next/link";
import { Sparkles, Users, FileText, Smartphone, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Referência Máxima - Plataforma de Mentoria com IA",
  description:
    "Transforme sua mentoria com relatórios gerados por inteligência artificial. Posicionamento, persona e mensagem clara para seus mentorados.",
};

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBFB] font-(family-name:--font-inter)">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="Referência Máxima"
              width={150}
              height={32}
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/suporte"
              className="text-sm text-[#71717A] hover:text-[#3F3F46] transition-colors"
            >
              Suporte
            </Link>
            <Link
              href="/"
              className="rounded-lg bg-[#ABA56E] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-[#ABA56E]/10 px-4 py-1.5 text-sm font-medium text-[#ABA56E]">
            Plataforma de Mentoria com IA
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-[#3F3F46] md:text-5xl">
            Transforme sua mentoria com{" "}
            <span className="text-[#ABA56E]">inteligência artificial</span>
          </h1>
          <p className="mb-8 text-lg text-[#71717A]">
            Gere relatórios de posicionamento, persona ideal e mensagem clara
            para seus mentorados em minutos. Tudo automatizado por IA.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-lg bg-[#ABA56E] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Começar agora
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#como-funciona"
              className="rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-[#3F3F46] transition-colors hover:bg-zinc-50"
            >
              Como funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-2xl font-bold text-[#3F3F46]">
            Tudo que você precisa para escalar sua mentoria
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Sparkles className="size-6 text-[#ABA56E]" />,
                title: "Relatórios com IA",
                desc: "3 relatórios gerados automaticamente: Persona/ICP, Posicionamento e Mensagem Clara.",
              },
              {
                icon: <Users className="size-6 text-[#ABA56E]" />,
                title: "Gestão de Mentorados",
                desc: "Cadastre mentorados, acompanhe o progresso e gerencie tudo em um painel centralizado.",
              },
              {
                icon: <FileText className="size-6 text-[#ABA56E]" />,
                title: "7 Cards de Mensagem",
                desc: "Mensagens estruturadas: Desejo, Problema, Guia, Plano, Convite, Sucesso e Fracasso.",
              },
              {
                icon: <Smartphone className="size-6 text-[#ABA56E]" />,
                title: "App para Mentorados",
                desc: "Seus mentorados acessam relatórios e cards direto pelo celular com um código de convite.",
              },
            ].map((feature, i) => (
              <div key={i} className="rounded-lg border border-zinc-100 p-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#ABA56E]/10">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-semibold text-[#3F3F46]">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#71717A]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-2xl font-bold text-[#3F3F46]">
            Como funciona
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Cadastre o mentorado",
                desc: "Preencha as informações básicas do seu mentorado no painel web.",
              },
              {
                step: "02",
                title: "Responda os questionários",
                desc: "Complete 3 rodadas de perguntas sobre persona, posicionamento e mensagem. A IA gera os relatórios automaticamente.",
              },
              {
                step: "03",
                title: "Compartilhe o acesso",
                desc: "Um código de convite é gerado automaticamente. O mentorado usa o código no app para acessar tudo pelo celular.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#ABA56E]/10 text-lg font-bold text-[#ABA56E]">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-[#3F3F46]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#71717A]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-zinc-200 bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#3F3F46]">
            Por que usar o Referência Máxima?
          </h2>
          <div className="space-y-4">
            {[
              "Economize horas de trabalho manual na criação de relatórios",
              "Relatórios consistentes e profissionais para cada mentorado",
              "Seu mentorado acessa tudo pelo celular, sem complicação",
              "Posicionamento, persona e mensagem clara em poucos minutos",
              "Dashboard completo para acompanhar todos os seus mentorados",
              "Exportação de relatórios em PDF para compartilhar",
            ].map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-zinc-100 px-5 py-4"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#ABA56E]" />
                <span className="text-sm text-[#3F3F46]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-[#3F3F46]">
            Pronto para transformar sua mentoria?
          </h2>
          <p className="mb-8 text-[#71717A]">
            Crie sua conta gratuitamente e comece a gerar relatórios com IA hoje
            mesmo.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-[#ABA56E] px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Criar conta grátis
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-8 py-6 text-center text-sm text-[#71717A]">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/suporte" className="hover:text-[#3F3F46] hover:underline">
            Suporte
          </Link>
          <span>·</span>
          <Link href="/termos" className="hover:text-[#3F3F46] hover:underline">
            Termos de Serviço
          </Link>
          <span>·</span>
          <Link href="/privacidade" className="hover:text-[#3F3F46] hover:underline">
            Política de Privacidade
          </Link>
        </div>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} Referência Máxima. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
}
