import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade - Referência Máxima",
  description: "Política de Privacidade do Referência Máxima",
};

export default function PrivacidadePage() {
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
          Política de Privacidade
        </h1>
        <p className="mb-8 text-sm text-[#71717A]">
          Última atualização: 17 de março de 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-[#3F3F46]">
          <section>
            <h2 className="mb-3 text-lg font-semibold">1. Introdução</h2>
            <p>
              O Referência Máxima (&quot;nós&quot;, &quot;nosso&quot; ou
              &quot;Plataforma&quot;) está comprometido com a proteção da
              privacidade dos seus usuários. Esta Política de Privacidade
              descreve como coletamos, usamos, armazenamos e protegemos suas
              informações pessoais quando você utiliza nosso painel web e
              aplicativo móvel.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              2. Informações que Coletamos
            </h2>

            <h3 className="mb-2 mt-4 font-medium">
              2.1. Informações fornecidas por você
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>Dados de cadastro:</strong> nome, endereço de email e
                senha (para mentores)
              </li>
              <li>
                <strong>Dados de perfil:</strong> foto de avatar, telefone,
                Instagram (opcionais)
              </li>
              <li>
                <strong>Dados de mentorados:</strong> nome, email, Instagram e
                telefone de mentorados cadastrados pelo mentor
              </li>
              <li>
                <strong>Respostas dos questionários:</strong> as respostas
                fornecidas nos 3 questionários utilizados para gerar os
                relatórios de IA
              </li>
            </ul>

            <h3 className="mb-2 mt-4 font-medium">
              2.2. Informações coletadas automaticamente
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>Dados de autenticação social:</strong> ao fazer login
                com Google ou Apple no aplicativo móvel, recebemos seu nome,
                email e identificador da conta social
              </li>
              <li>
                <strong>Dados de uso:</strong> informações sobre como você
                interage com a Plataforma, incluindo páginas visitadas e ações
                realizadas
              </li>
              <li>
                <strong>Dados técnicos:</strong> endereço IP, tipo de
                dispositivo, sistema operacional e navegador
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              3. Como Utilizamos suas Informações
            </h2>
            <p>Utilizamos suas informações para:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Criar e gerenciar sua conta na Plataforma</li>
              <li>Autenticar seu acesso ao painel web e ao aplicativo móvel</li>
              <li>
                Gerar relatórios de IA (Persona/ICP, Posicionamento e Mensagem
                Clara) com base nas respostas dos questionários
              </li>
              <li>
                Vincular mentores e mentorados por meio de códigos de convite
              </li>
              <li>Exibir relatórios e cards de mensagem aos mentorados</li>
              <li>Melhorar e otimizar a Plataforma</li>
              <li>
                Entrar em contato para suporte ou comunicações sobre o serviço
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              4. Processamento por Inteligência Artificial
            </h2>
            <p>
              As respostas fornecidas nos questionários são enviadas a serviços
              de inteligência artificial de terceiros para gerar os relatórios.
              Esses dados são processados de forma automatizada e podem ser
              retidos temporariamente pelo provedor de IA conforme suas
              políticas. Não utilizamos esses dados para treinar modelos de IA
              próprios ou de terceiros.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              5. Compartilhamento de Dados
            </h2>
            <p>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais
              com terceiros para fins de marketing. Podemos compartilhar dados
              nas seguintes situações:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Provedores de serviço:</strong> compartilhamos dados com
                provedores de IA, hospedagem e infraestrutura necessários para
                operar a Plataforma
              </li>
              <li>
                <strong>Vínculo mentor-mentorado:</strong> os relatórios e cards
                gerados pelo mentor ficam acessíveis ao mentorado vinculado
              </li>
              <li>
                <strong>Requisitos legais:</strong> podemos divulgar informações
                quando exigido por lei ou para proteger nossos direitos
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              6. Armazenamento e Segurança
            </h2>
            <p>
              Seus dados são armazenados em servidores seguros com criptografia.
              Senhas são armazenadas de forma hash e nunca em texto plano.
              Tokens de autenticação (JWT) possuem prazo de validade limitado.
              Embora adotemos medidas razoáveis para proteger suas informações,
              nenhum sistema é 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              7. Retenção de Dados
            </h2>
            <p>
              Mantemos suas informações pessoais pelo tempo necessário para
              fornecer o serviço e cumprir obrigações legais. Ao excluir sua
              conta ou solicitar a remoção dos dados, removeremos suas
              informações pessoais dentro de um prazo razoável, exceto quando a
              retenção for exigida por lei.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">8. Seus Direitos</h2>
            <p>
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem
              direito a:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>
                Solicitar a anonimização, bloqueio ou eliminação de dados
                desnecessários
              </li>
              <li>
                Solicitar a portabilidade dos dados a outro fornecedor de
                serviço
              </li>
              <li>
                Solicitar a eliminação dos dados pessoais tratados com
                consentimento
              </li>
              <li>
                Revogar o consentimento a qualquer momento
              </li>
            </ul>
            <p className="mt-2">
              Para exercer seus direitos, entre em contato pelo email{" "}
              <a
                href="mailto:suporte@referenciamaxima.com.br"
                className="text-[#ABA56E] hover:underline"
              >
                suporte@referenciamaxima.com.br
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              9. Cookies e Armazenamento Local
            </h2>
            <p>
              Utilizamos cookies e localStorage para manter sua sessão
              autenticada e armazenar preferências. Esses dados são essenciais
              para o funcionamento da Plataforma e não são utilizados para
              rastreamento publicitário.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              10. Menores de Idade
            </h2>
            <p>
              A Plataforma não é destinada a menores de 18 anos. Não coletamos
              intencionalmente informações de menores. Se tomarmos conhecimento
              de que coletamos dados de um menor, tomaremos medidas para
              removê-los.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              11. Alterações nesta Política
            </h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. As
              alterações serão publicadas nesta página com a data de atualização
              revisada. Recomendamos que você revise esta política regularmente.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">12. Contato</h2>
            <p>
              Para dúvidas ou solicitações relacionadas à privacidade, entre em
              contato:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Email:{" "}
                <a
                  href="mailto:suporte@referenciamaxima.com.br"
                  className="text-[#ABA56E] hover:underline"
                >
                  suporte@referenciamaxima.com.br
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white px-8 py-6 text-center text-sm text-[#71717A]">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/termos" className="hover:text-[#3F3F46] hover:underline">
            Termos de Serviço
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
