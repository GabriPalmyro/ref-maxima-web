import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Serviço - Referência Máxima",
  description: "Termos de Serviço do Referência Máxima",
};

export default function TermosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBFB] font-(family-name:--font-inter)">
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
        <h1 className="mb-2 text-3xl font-bold text-[#3F3F46]">
          Termos de Serviço
        </h1>
        <p className="mb-8 text-sm text-[#71717A]">
          Última atualização: 17 de março de 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-[#3F3F46]">
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao acessar ou utilizar a plataforma Referência Máxima
              (&quot;Plataforma&quot;), incluindo o painel web e o aplicativo
              móvel, você concorda em cumprir e estar vinculado a estes Termos de
              Serviço. Se você não concordar com qualquer parte destes termos,
              não utilize a Plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              2. Descrição do Serviço
            </h2>
            <p>
              O Referência Máxima é uma plataforma de mentoria que utiliza
              inteligência artificial para gerar relatórios de posicionamento,
              persona ideal e mensagem clara. O serviço inclui:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Painel web para mentores cadastrarem e gerenciarem mentorados
              </li>
              <li>
                Geração automatizada de relatórios por inteligência artificial
              </li>
              <li>
                Aplicativo móvel para mentorados acessarem seus relatórios e
                cards de mensagem
              </li>
              <li>
                Sistema de códigos de convite para vinculação
                mentor-mentorado
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">3. Cadastro e Conta</h2>
            <p>
              Para utilizar a Plataforma como mentor, você deve criar uma conta
              fornecendo informações verdadeiras e atualizadas. Você é
              responsável por manter a confidencialidade de suas credenciais de
              acesso e por todas as atividades realizadas em sua conta.
            </p>
            <p className="mt-2">
              Mentorados acessam a Plataforma por meio do aplicativo móvel,
              utilizando autenticação social (Google ou Apple) e um código de
              convite fornecido pelo mentor.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              4. Uso Aceitável
            </h2>
            <p>Ao utilizar a Plataforma, você concorda em:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Fornecer informações verdadeiras e precisas nos questionários
              </li>
              <li>
                Não utilizar a Plataforma para fins ilegais ou não autorizados
              </li>
              <li>
                Não tentar acessar contas de outros usuários ou áreas restritas
                do sistema
              </li>
              <li>
                Não reproduzir, duplicar ou revender qualquer parte do serviço
                sem autorização
              </li>
              <li>
                Respeitar os direitos de propriedade intelectual da Plataforma
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              5. Conteúdo Gerado por IA
            </h2>
            <p>
              Os relatórios e cards de mensagem gerados pela inteligência
              artificial são baseados nas respostas fornecidas nos questionários.
              O Referência Máxima não garante a precisão, completude ou
              adequação do conteúdo gerado para qualquer finalidade específica.
              Os relatórios devem ser utilizados como ferramenta auxiliar de
              mentoria, não como aconselhamento profissional definitivo.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              6. Propriedade Intelectual
            </h2>
            <p>
              Todo o conteúdo da Plataforma, incluindo mas não limitado a
              software, design, textos, gráficos, logos e marcas, é propriedade
              do Referência Máxima ou de seus licenciadores. Os relatórios
              gerados pela IA a partir das informações do usuário são de uso do
              mentor e seu mentorado, porém a tecnologia e os modelos
              subjacentes permanecem propriedade da Plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              7. Limitação de Responsabilidade
            </h2>
            <p>
              A Plataforma é fornecida &quot;como está&quot; e &quot;conforme
              disponível&quot;. Na máxima extensão permitida pela lei aplicável,
              o Referência Máxima não será responsável por quaisquer danos
              indiretos, incidentais, especiais, consequenciais ou punitivos,
              incluindo perda de lucros, dados ou outras perdas intangíveis,
              resultantes do uso ou da incapacidade de usar o serviço.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              8. Suspensão e Encerramento
            </h2>
            <p>
              Reservamo-nos o direito de suspender ou encerrar sua conta a
              qualquer momento, com ou sem aviso prévio, caso identifiquemos
              violação destes Termos ou uso inadequado da Plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              9. Alterações nos Termos
            </h2>
            <p>
              Podemos modificar estes Termos de Serviço a qualquer momento. As
              alterações entram em vigor imediatamente após a publicação na
              Plataforma. O uso continuado do serviço após modificações
              constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              10. Legislação Aplicável
            </h2>
            <p>
              Estes Termos de Serviço são regidos e interpretados de acordo com
              as leis da República Federativa do Brasil. Quaisquer disputas
              serão submetidas ao foro da comarca de domicílio do Referência
              Máxima.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">11. Contato</h2>
            <p>
              Para dúvidas sobre estes Termos de Serviço, entre em contato pelo
              email{" "}
              <a
                href="mailto:suporte@referenciamaxima.com.br"
                className="text-[#ABA56E] hover:underline"
              >
                suporte@referenciamaxima.com.br
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white px-8 py-6 text-center text-sm text-[#71717A]">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/privacidade" className="hover:text-[#3F3F46] hover:underline">
            Política de Privacidade
          </Link>
          <span>·</span>
          <Link href="/suporte" className="hover:text-[#3F3F46] hover:underline">
            Suporte
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
