import ProfitCalculator from '@/components/ProfitCalculator';
import { Calculator, TrendingUp, DollarSign, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              Calculadora de Lucro Shopee e Mercado Livre 2026
            </h1>
          </div>
          <p className="text-center text-green-100 text-lg max-w-3xl mx-auto">
            Descubra seu lucro real em vendas online. Calcule taxas, comissões e impostos com as regras atualizadas de 2026.
          </p>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ProfitCalculator />

        {/* Como Calcular Section - SEO Content */}
        <div className="mt-12 space-y-8">
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Como Calcular o Lucro Real em Marketplaces
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Calcular o lucro real nas vendas online vai muito além de subtrair o custo do produto do preço de venda. 
                Para vendedores brasileiros em 2026, é essencial considerar todas as taxas e impostos dos marketplaces.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Taxas do Shopee em 2026
              </h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                O Shopee cobra uma estrutura de taxas composta por:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>14% de comissão base</strong> sobre o valor do produto</li>
                <li><strong>6% adicional para Frete Grátis</strong> (programa obrigatório em muitas categorias)</li>
                <li><strong>R$ 4,00 de taxa fixa</strong> por item vendido</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Total: aproximadamente 20% + R$ 4,00 por venda.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Taxas do Mercado Livre em 2026
              </h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                O Mercado Livre oferece dois tipos de anúncio:
              </p>
              <div className="space-y-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Anúncio Clássico:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Comissão entre 11% a 14% (varia por categoria, média ~12,5%)</li>
                    <li>R$ 6,50 de taxa fixa para produtos abaixo de R$ 79,00</li>
                    <li>Não permite parcelamento sem juros</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Anúncio Premium:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Comissão entre 16% a 19% (média ~17,5%)</li>
                    <li>R$ 6,50 de taxa fixa para produtos abaixo de R$ 79,00</li>
                    <li>Permite parcelamento e maior destaque nos resultados</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Vendas por Pix ou Diretas
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para vendas diretas via WhatsApp, Instagram ou site próprio, as taxas são bem menores. 
                Gateways de pagamento Pix costumam cobrar entre 0% a 1% por transação, sendo uma alternativa 
                muito mais lucrativa para quem consegue vender sem depender dos marketplaces.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              Impostos para Vendedores Online
            </h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">
                MEI - Microempreendedor Individual
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Se você é MEI, paga um valor fixo mensal de <strong>R$ 81,05</strong> através do DAS (Documento de Arrecadação do Simples Nacional). 
                Este valor já cobre INSS, ISS/ICMS e não varia com o faturamento. O limite de faturamento anual para MEI em 2026 é de R$ 81.000,00.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Simples Nacional
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Se você ultrapassou o limite do MEI ou optou pelo Simples Nacional, a alíquota varia conforme seu faturamento e atividade. 
                Para comércio (Anexo I), as alíquotas começam em torno de <strong>4% a 6%</strong> para faixas iniciais e podem chegar a 
                <strong>11,35%</strong> em faixas maiores.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              Dicas para Aumentar sua Margem de Lucro
            </h2>
            <div className="prose prose-gray max-w-none">
              <ul className="list-disc list-inside text-gray-700 space-y-3">
                <li>
                  <strong>Negocie com fornecedores:</strong> Quanto menor o custo do produto, maior seu lucro. 
                  Compre em volume para conseguir descontos.
                </li>
                <li>
                  <strong>Otimize embalagens:</strong> Use embalagens adequadas ao tamanho do produto para economizar 
                  no frete e no material.
                </li>
                <li>
                  <strong>Compare marketplaces:</strong> Use nossa calculadora para simular o mesmo produto em diferentes 
                  plataformas e escolha a mais lucrativa.
                </li>
                <li>
                  <strong>Considere vendas diretas:</strong> Invista em canais próprios (Instagram, WhatsApp, site) 
                  para reduzir taxas de marketplace.
                </li>
                <li>
                  <strong>Conheça seu ponto de equilíbrio:</strong> Saiba o preço mínimo que você pode vender sem ter prejuízo 
                  e use isso nas negociações e promoções.
                </li>
                <li>
                  <strong>Mantenha-se atualizado:</strong> As taxas dos marketplaces mudam periodicamente. 
                  Recalcule seus preços sempre que houver alterações.
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-green-50 rounded-xl border-2 border-green-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Por que usar esta calculadora?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Atualizada para 2026</h3>
                <p className="text-gray-700 text-sm">
                  Todas as taxas e regras dos marketplaces brasileiros atualizadas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ 100% Gratuita</h3>
                <p className="text-gray-700 text-sm">
                  Sem cadastro, sem limite de uso, sem pegadinhas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Cálculo Completo</h3>
                <p className="text-gray-700 text-sm">
                  Considera todas as taxas, impostos MEI/Simples e custos operacionais.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Fácil Compartilhar</h3>
                <p className="text-gray-700 text-sm">
                  Copie o resumo e cole direto no WhatsApp para sua equipe.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 DBC Data Studio. Calculadora de Lucro para Marketplaces Brasileiros.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Esta calculadora é uma ferramenta educacional. Consulte sempre um contador para orientações específicas sobre impostos.
          </p>
        </div>
      </footer>
    </main>
  );
}

