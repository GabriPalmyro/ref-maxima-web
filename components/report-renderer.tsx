"use client";

import ReactMarkdown from "react-markdown";

// ── Persona ICP ──

interface PersonaIcpData {
  nomeFicticio: string;
  resumo: string;
  dadosDemograficos: {
    nome: string;
    genero: string;
    idade: string;
    escolaridade: string;
    ocupacao: string;
    religiao: string;
    rendaMedia: string;
    relacionamento: string;
    narrativa: string;
  };
  caracteristicasAmaria: string[];
  caracteristicasNaoAtenderia: string[];
  inimigosCliente: string[];
  oQueMaisValoriza: string[];
  comoObterResultado: string;
  diagnosticoProfundo: {
    desejos: string[];
    dores: string[];
    emocoes: string[];
    medos: string[];
    objecoes: string[];
  };
  vidaIdeal: string;
  cenarioNegativo: string;
  localizacaoCliente: string[];
  ideiasConteudo: string[];
}

function PersonaIcpRenderer({ data }: { data: PersonaIcpData }) {
  const d = data.dadosDemograficos;
  const diag = data.diagnosticoProfundo;

  return (
    <div className="space-y-6">
      <h3 className="text-[24px] font-medium text-black">
        Quem é {data.nomeFicticio}?
      </h3>
      <p className="text-[16px] leading-[22px] text-black">{data.resumo}</p>

      <Section title="Dados Demográficos">
        <ul className="list-disc pl-6 space-y-1 text-[16px] leading-[18px] text-black">
          <li>Nome (figurativo): {d.nome}</li>
          <li>Gênero: {d.genero}</li>
          <li>Idade: {d.idade}</li>
          <li>Escolaridade: {d.escolaridade}</li>
          <li>Ocupação: {d.ocupacao}</li>
          <li>Religião: {d.religiao}</li>
          <li>Renda média: {d.rendaMedia}</li>
          <li>Relacionamento: {d.relacionamento}</li>
        </ul>
        <p className="mt-3 text-[16px] leading-[22px] text-black">
          {d.narrativa}
        </p>
      </Section>

      <BulletSection title="Características que você AMARIA atender" items={data.caracteristicasAmaria} />
      <BulletSection title="Características que você NÃO atenderia" items={data.caracteristicasNaoAtenderia} />
      <BulletSection title="Inimigos do cliente" items={data.inimigosCliente} />
      <BulletSection title="O que ele mais valoriza" items={data.oQueMaisValoriza} />

      <Section title="Como ele pode obter o resultado">
        <p className="text-[16px] leading-[22px] text-black">
          {data.comoObterResultado}
        </p>
      </Section>

      <Section title="Diagnóstico Profundo">
        <DiagSubsection title="Desejos" items={diag.desejos} />
        <DiagSubsection title="Dores" items={diag.dores} />
        <DiagSubsection title="Emoções" items={diag.emocoes} />
        <DiagSubsection title="Medos" items={diag.medos} />
        <DiagSubsection title="Objeções" items={diag.objecoes} />
      </Section>

      <Section title="Vida Ideal">
        <p className="text-[16px] leading-[22px] text-black">{data.vidaIdeal}</p>
      </Section>

      <Section title="Cenário Negativo">
        <p className="text-[16px] leading-[22px] text-black">{data.cenarioNegativo}</p>
      </Section>

      <BulletSection title="Localização do Cliente" items={data.localizacaoCliente} />
      <BulletSection title="Ideias de Conteúdo" items={data.ideiasConteudo} />
    </div>
  );
}

// ── Posicionamento ──

interface PosicionamentoData {
  sections: Array<{
    key: string;
    title: string;
    content: string;
  }>;
}

function PosicionamentoRenderer({ data, nome }: { data: PosicionamentoData; nome?: string }) {
  return (
    <div className="space-y-6">
      {nome && (
        <h3 className="text-[24px] font-medium text-black">
          Posicionamento {nome}
        </h3>
      )}
      {data.sections.map((section) => (
        <Section key={section.key} title={section.title}>
          <p className="text-[16px] leading-[22px] text-black">
            {section.content}
          </p>
        </Section>
      ))}
    </div>
  );
}

// ── Mensagem Clara ──

interface MensagemClaraData {
  cards: Array<{
    type: string;
    title: string;
    subtitle: string;
    bodyText: string;
    bulletPoints: string[];
  }>;
}

function MensagemClaraRenderer({ data, nome }: { data: MensagemClaraData; nome?: string }) {
  return (
    <div className="space-y-6">
      {nome && (
        <h3 className="text-[24px] font-medium text-black">
          Mensagem Clara {nome}
        </h3>
      )}
      {data.cards.map((card, i) => (
        <div key={card.type}>
          <h4 className="text-[20px] font-medium text-black mb-2">
            {i + 1}. {card.title}
          </h4>
          <p className="text-[16px] leading-[22px] text-black whitespace-pre-line">
            {card.bodyText}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Shared helpers ──

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[20px] font-medium text-black mb-2">{title}</h4>
      {children}
    </div>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <Section title={title}>
      <ul className="list-disc pl-6 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-[16px] leading-[18px] text-black">
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function DiagSubsection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-3">
      <p className="text-[16px] font-semibold text-black mb-1">{title}</p>
      <ul className="list-disc pl-6 space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-[16px] leading-[18px] text-black">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Markdown fallback (for old reports without structuredContent) ──

function MarkdownFallback({ content }: { content: string }) {
  return (
    <div className="[&_hr]:my-4 [&_hr]:border-zinc-200 [&_li]:text-[16px] [&_li]:leading-[18px] [&_li]:text-black [&_ol]:mb-[9px] [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-[9px] [&_p]:text-[16px] [&_p]:leading-[18px] [&_p]:text-black [&_strong]:font-semibold [&_ul]:mb-[9px] [&_ul]:list-disc [&_ul]:pl-6">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

// ── Main export ──

interface ReportRendererProps {
  type: string;
  structuredContent?: Record<string, unknown> | null;
  rawResponse?: string | null;
  menteeName?: string;
}

export function ReportRenderer({
  type,
  structuredContent,
  rawResponse,
  menteeName,
}: ReportRendererProps) {
  // Try structured rendering first
  if (structuredContent) {
    try {
      if (type === "PERSONA_ICP" && structuredContent.nomeFicticio) {
        return <PersonaIcpRenderer data={structuredContent as unknown as PersonaIcpData} />;
      }
      if (type === "POSICIONAMENTO" && structuredContent.sections) {
        return <PosicionamentoRenderer data={structuredContent as unknown as PosicionamentoData} nome={menteeName} />;
      }
      if (type === "MENSAGEM_CLARA" && structuredContent.cards) {
        return <MensagemClaraRenderer data={structuredContent as unknown as MensagemClaraData} nome={menteeName} />;
      }
    } catch {
      // Fall through to markdown
    }
  }

  // Fallback to raw markdown
  if (rawResponse) {
    return <MarkdownFallback content={rawResponse} />;
  }

  return <p className="text-sm text-zinc-400">Sem conteúdo disponível.</p>;
}
