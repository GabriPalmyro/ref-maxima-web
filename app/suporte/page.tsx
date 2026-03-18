import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, Clock, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Suporte - Referência Máxima",
  description: "Central de suporte e ajuda do Referência Máxima",
};

export default function SuportePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBFB] font-(family-name:--font-inter)">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-4">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Referência Máxima"
            width={150}
            height={32}
          />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-[#71717A] hover:text-[#3F3F46] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        {/* Title */}
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold text-[#3F3F46]">
            Central de Suporte
          </h1>
          <p className="text-[#71717A]">
            Como podemos te ajudar? Escolha uma das opções abaixo.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#ABA56E]/10">
              <Mail className="size-6 text-[#ABA56E]" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-[#3F3F46]">
              Email
            </h2>
            <p className="mb-4 text-sm text-[#71717A]">
              Envie sua dúvida ou problema por email e responderemos o mais
              rápido possível.
            </p>
            <a
              href="mailto:suporte@referenciamaxima.com.br"
              className="text-sm font-medium text-[#ABA56E] hover:underline"
            >
              suporte@referenciamaxima.com.br
            </a>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#ABA56E]/10">
              <MessageCircle className="size-6 text-[#ABA56E]" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-[#3F3F46]">
              WhatsApp
            </h2>
            <p className="mb-4 text-sm text-[#71717A]">
              Fale diretamente conosco pelo WhatsApp para suporte rápido.
            </p>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#ABA56E] hover:underline"
            >
              Abrir WhatsApp
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-[#3F3F46]">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Como faço para criar um mentorado?",
                a: "Após fazer login no painel, clique em 'Novo Mentorado' no dashboard. Preencha as informações básicas e siga o fluxo de questionários para gerar os relatórios de IA.",
              },
              {
                q: "Como meu mentorado acessa os relatórios pelo celular?",
                a: "Após gerar os relatórios, um código de convite será criado automaticamente. Compartilhe esse código com seu mentorado. Ele deve baixar o app, fazer login com Google ou Apple e inserir o código para acessar os relatórios.",
              },
              {
                q: "O código de convite expirou. O que fazer?",
                a: "Os códigos de convite expiram em 7 dias. Você pode gerar um novo código na página de detalhes do mentorado no painel web.",
              },
              {
                q: "Posso editar os relatórios depois de gerados?",
                a: "Atualmente os relatórios são gerados pela IA com base nas respostas do questionário. Para obter um resultado diferente, você pode solicitar a correção do relatório.",
              },
              {
                q: "Como excluo um mentorado?",
                a: "No dashboard, clique no ícone de lixeira ao lado do mentorado que deseja excluir. Atenção: essa ação é irreversível e remove todos os dados associados.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-lg border border-zinc-200 bg-white"
              >
                <summary className="cursor-pointer px-6 py-4 text-sm font-medium text-[#3F3F46] hover:bg-zinc-50">
                  {item.q}
                </summary>
                <p className="border-t border-zinc-100 px-6 py-4 text-sm text-[#71717A]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Response Time */}
        <div className="mt-12 flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <Clock className="size-5 text-[#ABA56E]" />
          <p className="text-sm text-[#71717A]">
            Nosso tempo médio de resposta é de <strong>até 24 horas</strong> em
            dias úteis.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-8 py-6 text-center text-sm text-[#71717A]">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/termos" className="hover:text-[#3F3F46] hover:underline">
            Termos de Serviço
          </Link>
          <span>·</span>
          <Link href="/privacidade" className="hover:text-[#3F3F46] hover:underline">
            Política de Privacidade
          </Link>
          <span>·</span>
          <Link href="/marketing" className="hover:text-[#3F3F46] hover:underline">
            Sobre
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
