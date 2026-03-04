import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Recebido formulário para processar persona:", body);

        // Simulando delay de geração de IA (1.5 segundos)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockPersona = {
            personaName: "Rafael",
            paragraphs: [
                "Rafael é um empreendedor digital entre 30 e 42 anos que construiu sua carreira tentando escalar negócios online, mas se vê constantemente preso em operações que consomem seu tempo e energia. Ele tem um conhecimento sólido sobre marketing digital, mas sente que falta estrutura e direcionamento estratégico para dar o próximo salto.",
                "Seu maior desejo é conquistar liberdade — financeira e geográfica — através de um negócio que funcione sem depender inteiramente da sua presença. Rafael busca um mentor que já percorreu esse caminho e que possa oferecer um método claro, validado e replicável, sem teorias vagas ou estratégias genéricas.",
                "Ele valoriza profundamente a autoridade construída com base em resultados reais. Quando investe em mentoria ou formação, Rafael precisa enxergar provas concretas de transformação. É cético em relação a promessas exageradas, mas altamente comprometido quando encontra o guia certo."
            ],
            demographics: [
                { label: "Idade", value: "30–42 anos" },
                { label: "Ocupação", value: "Empreendedor Digital" },
                { label: "Localização", value: "Brasil (capitais)" },
                { label: "Renda mensal", value: "R$ 8.000–25.000", locked: true },
                { label: "Nível de consciência", value: "Consciente do problema", locked: true },
                { label: "Canal principal", value: "Instagram & YouTube", locked: true },
            ]
        };

        return NextResponse.json({ success: true, persona: mockPersona });
    } catch {
        return NextResponse.json({ success: false, error: "Erro ao processar persona" }, { status: 500 });
    }
}
