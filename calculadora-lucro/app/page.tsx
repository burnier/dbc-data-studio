import ProfitCalculator from '@/components/ProfitCalculator';
import { Calculator, TrendingUp, DollarSign, Shield, HelpCircle, BookOpen } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-10 w-10" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              Calculadora de Lucro Shopee e Mercado Livre 2026
            </h1>
          </div>
          <p className="text-center text-green-100 text-lg max-w-3xl mx-auto mb-3">
            Descubra seu lucro real em vendas online. Calcule as taxas dos marketplaces, comissões e impostos para precificar seus produtos corretamente.
          </p>
          <p className="text-center text-green-200 text-sm font-semibold">
            ✓ Atualizado com as taxas de Março de 2026
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" aria-label="Índice">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-green-600" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-900">Neste Guia:</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <li><a href="#calculadora" className="text-green-600 hover:text-green-700 hover:underline">→ Calculadora Interativa</a></li>
            <li><a href="#como-calcular" className="text-green-600 hover:text-green-700 hover:underline">→ Como Calcular o Lucro</a></li>
            <li><a href="#taxas-shopee" className="text-green-600 hover:text-green-700 hover:underline">→ Taxas Shopee 2026</a></li>
            <li><a href="#taxas-mercadolivre" className="text-green-600 hover:text-green-700 hover:underline">→ Taxas Mercado Livre 2026</a></li>
            <li><a href="#impostos" className="text-green-600 hover:text-green-700 hover:underline">→ Impostos (MEI e Simples)</a></li>
            <li><a href="#dicas" className="text-green-600 hover:text-green-700 hover:underline">→ Dicas para Aumentar Margem</a></li>
            <li><a href="#faq" className="text-green-600 hover:text-green-700 hover:underline">→ Perguntas Frequentes</a></li>
            <li><a href="#por-que-usar" className="text-green-600 hover:text-green-700 hover:underline">→ Por Que Usar Esta Calculadora</a></li>
          </ul>
        </nav>
      </div>

      {/* Calculator Section */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div id="calculadora">
          <ProfitCalculator />
        </div>

        {/* Educational Content - SEO Optimized */}
        <div className="mt-12 space-y-8">
          <section id="como-calcular" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" aria-hidden="true" />
              Como Calcular o Lucro Real em Marketplaces
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Muitos vendedores iniciantes acreditam que calcular o lucro é só diminuir o custo do produto do preço de venda. Mas essa conta simplificada pode levar ao prejuízo!
                No mercado brasileiro de 2026, é essencial considerar <strong>todas as taxas dos marketplaces, custos operacionais e impostos</strong> para ter uma visão real da rentabilidade do seu negócio.
              </p>

              <h3 id="taxas-shopee" className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Taxas do Shopee em 2026 (Atualizadas Março 2026)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                O Shopee implementou uma estrutura de taxas composta em 2026 que todo vendedor precisa conhecer:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>14% de comissão base</strong> sobre o valor do produto vendido</li>
                <li><strong>6% adicional para Frete Grátis</strong> (programa que se tornou obrigatório em muitas categorias)</li>
                <li><strong>R$ 4,00 de taxa fixa por item</strong> vendido (independente do valor)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-2">
                <strong>Resultado final:</strong> Aproximadamente 20% de comissão + R$ 4,00 por venda. Para um produto de R$ 100, você paga R$ 24,00 em taxas ao Shopee.
              </p>

              <h3 id="taxas-mercadolivre" className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Taxas do Mercado Livre em 2026 (Atualizadas Março 2026)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                O Mercado Livre oferece dois tipos de anúncio com taxas diferenciadas:
              </p>
              <div className="space-y-4 mb-4">
                <div className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50">
                  <h4 className="font-semibold text-gray-900">Anúncio Clássico:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                    <li>Comissão entre <strong>11% a 14%</strong> (varia por categoria, média ~12,5%)</li>
                    <li><strong>R$ 6,50 de taxa fixa</strong> para produtos abaixo de R$ 79,00</li>
                    <li>Não permite parcelamento sem juros</li>
                    <li>Menor destaque nos resultados de busca</li>
                  </ul>
                </div>
                <div className="border-l-4 border-purple-400 pl-4 py-2 bg-purple-50">
                  <h4 className="font-semibold text-gray-900">Anúncio Premium:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                    <li>Comissão entre <strong>16% a 19%</strong> (média ~17,5%)</li>
                    <li><strong>R$ 6,50 de taxa fixa</strong> para produtos abaixo de R$ 79,00</li>
                    <li>Permite parcelamento em até 12x sem juros</li>
                    <li>Maior destaque nos resultados e selo Premium</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Vendas Diretas por Pix: Muito Mais Lucrativo
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Se você vende direto pelo WhatsApp, Instagram ou tem site próprio, aceitar Pix é disparado a opção mais rentável.
                As plataformas de pagamento Pix cobram entre <strong>0% a 1% por transação</strong> — uma diferença brutal comparado aos marketplaces.
                Veja só: numa venda de R$ 100, você economiza até R$ 23,50 em taxas comparado ao Shopee!
              </p>
            </div>
          </section>

          <section id="impostos" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" aria-hidden="true" />
              Impostos para Vendedores Online: MEI e Simples Nacional
            </h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">
                MEI - Microempreendedor Individual
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Se você é MEI, paga um valor fixo mensal de <strong>R$ 81,05</strong> através do DAS (Documento de Arrecadação do Simples Nacional).
                Esta contribuição já cobre INSS, ISS/ICMS e não varia com o faturamento. <strong>Atenção:</strong> O limite de faturamento anual para MEI em 2026 permanece em R$ 81.000,00 (aproximadamente R$ 6.750,00 por mês).
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                <p className="text-sm text-gray-700">
                  <strong>💡 Dica importante:</strong> Nossa calculadora não desconta o DAS do MEI por venda (mantém R$ 0), pois ele é um custo fixo mensal que independe do volume de vendas.
                  Se quiser incluir na análise, divida os R$ 81,05 pelo seu número médio de vendas por mês e considere como custo adicional por unidade.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Simples Nacional - Anexo I (Comércio)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ultrapassou o limite do MEI ou já começou direto no Simples Nacional? Nesse regime, você paga um percentual sobre cada venda que varia conforme seu faturamento total acumulado.
                Para comércio (Anexo I), as alíquotas começam em torno de <strong>4% a 6%</strong> nas faixas menores de faturamento e podem chegar a
                <strong>11,35%</strong> nas faixas mais altas. Esse imposto é calculado sobre cada venda que você realiza.
              </p>
            </div>
          </section>

          <section id="dicas" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-600" aria-hidden="true" />
              7 Estratégias para Aumentar sua Margem de Lucro
            </h2>
            <div className="prose prose-gray max-w-none">
              <ul className="list-disc list-inside text-gray-700 space-y-4">
                <li>
                  <strong>Negocie em volume com fornecedores:</strong> Quanto menor o custo do produto, maior seu lucro final.
                  Faça cotações com múltiplos fornecedores e negocie descontos progressivos por volume de compra. Uma redução de 10% no custo pode dobrar sua margem.
                </li>
                <li>
                  <strong>Otimize o peso e tamanho das embalagens:</strong> Use embalagens adequadas ao tamanho do produto para economizar
                  no frete e no material. Embalagens menores e mais leves podem reduzir custos de envio em até 40%.
                </li>
                <li>
                  <strong>Teste o mesmo produto em diferentes marketplaces:</strong> Use nossa calculadora para simular quanto você ganharia vendendo o mesmo item na Shopee, Mercado Livre Clássico, Mercado Livre Premium ou por Pix.
                  Escolha o canal mais lucrativo para cada tipo de produto do seu catálogo.
                </li>
                <li>
                  <strong>Construa canais de venda direta:</strong> Invista em canais próprios (Instagram, WhatsApp, site)
                  para reduzir a dependência dos marketplaces e suas taxas. Vendas diretas para clientes recorrentes podem ter margem até 3x maior.
                </li>
                <li>
                  <strong>Domine seu ponto de equilíbrio:</strong> Saiba exatamente o preço mínimo que você pode vender sem ter prejuízo.
                  Use esse conhecimento estrategicamente em negociações, promoções e liquidações de estoque.
                </li>
                <li>
                  <strong>Monitore mudanças de taxas mensalmente:</strong> Os marketplaces ajustam suas taxas periodicamente.
                  Recalcule seus preços sempre que houver alterações para manter sua margem protegida.
                </li>
                <li>
                  <strong>Compare produtos de alta rotação com produtos de alta margem:</strong> Nem sempre o produto mais vendido é o mais lucrativo.
                  Equilibre seu mix de produtos entre itens de volume (menor margem, muitas vendas) e produtos premium (alta margem, menos vendas).
                </li>
              </ul>
            </div>
          </section>

          {/* FAQ Section - Intent-Based Content */}
          <section id="faq" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
              Perguntas Frequentes sobre Lucro em Marketplaces
            </h2>
            <Accordion>
              <AccordionItem value="faq-1">
                <AccordionTrigger>
                  Como calcular o lucro da Shopee em 2026?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    Para calcular o lucro real na Shopee em 2026, você precisa seguir esta fórmula profissional:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-3 font-mono text-sm">
                    Lucro Líquido = Preço de Venda - Custo do Produto - Custo de Embalagem - Custo de Frete - (Preço × 20%) - R$ 4,00 - Impostos
                  </div>
                  <p className="mb-2">
                    <strong>Exemplo prático:</strong> Produto vendido por R$ 100
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Custo do produto: R$ 40</li>
                    <li>Embalagem: R$ 5</li>
                    <li>Frete: R$ 15</li>
                    <li>Comissão Shopee (20%): R$ 20</li>
                    <li>Taxa fixa: R$ 4</li>
                    <li><strong>Lucro líquido (MEI): R$ 16 (16% de margem)</strong></li>
                  </ul>
                  <p className="mt-3 text-sm">
                    Use nossa calculadora acima para fazer esse cálculo automaticamente com seus valores reais!
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2">
                <AccordionTrigger>
                  Quais são as novas taxas do Mercado Livre em 2026?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    O Mercado Livre atualizou suas taxas em Março de 2026. Existem dois modelos:
                  </p>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-400 pl-3 py-1">
                      <p className="font-semibold">Anúncio Clássico:</p>
                      <ul className="text-sm space-y-1 ml-4 mt-1">
                        <li>• Comissão: 11% a 14% (média 12,5%)</li>
                        <li>• Taxa fixa: R$ 6,50 se o produto custar menos de R$ 79</li>
                        <li>• Não permite parcelamento</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-purple-400 pl-3 py-1">
                      <p className="font-semibold">Anúncio Premium:</p>
                      <ul className="text-sm space-y-1 ml-4 mt-1">
                        <li>• Comissão: 16% a 19% (média 17,5%)</li>
                        <li>• Taxa fixa: R$ 6,50 se o produto custar menos de R$ 79</li>
                        <li>• Permite parcelamento em até 12x</li>
                        <li>• Mais destaque nos resultados de busca</li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-3 text-sm bg-yellow-50 p-2 rounded">
                    <strong>Importante:</strong> A taxa fixa de R$ 6,50 é removida automaticamente quando o produto custa R$ 79 ou mais.
                    Para produtos abaixo desse valor, essa taxa pode impactar significativamente a margem.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3">
                <AccordionTrigger>
                  Vender por Pix vale a pena para MEI?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    <strong>Sim, definitivamente!</strong> Vender por Pix é a opção mais lucrativa para MEI em 2026. Veja a comparação:
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                    <p className="font-semibold mb-2">Exemplo: Venda de R$ 100</p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-green-300">
                          <th className="text-left py-1">Canal</th>
                          <th className="text-right py-1">Taxas</th>
                          <th className="text-right py-1">Lucro*</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-green-200">
                        <tr>
                          <td className="py-1">Shopee</td>
                          <td className="text-right">R$ 24,00</td>
                          <td className="text-right">R$ 16,00</td>
                        </tr>
                        <tr>
                          <td className="py-1">Mercado Livre Premium</td>
                          <td className="text-right">R$ 17,50</td>
                          <td className="text-right">R$ 22,50</td>
                        </tr>
                        <tr className="font-bold bg-green-100">
                          <td className="py-1">Pix (0,5%)</td>
                          <td className="text-right">R$ 0,50</td>
                          <td className="text-right">R$ 39,50</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-xs mt-2">*Considerando custos fixos de R$ 60 (produto + embalagem + frete)</p>
                  </div>
                  <p className="mb-2">
                    <strong>Vantagens do Pix para MEI:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Taxa de intermediação geralmente entre 0% a 1%</li>
                    <li>Margem de lucro até 2,5x maior que marketplaces</li>
                    <li>Recebimento instantâneo (não precisa esperar 14-30 dias)</li>
                    <li>Relacionamento direto com o cliente (fidelização)</li>
                    <li>Sem burocracia de plataforma</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    <strong>Desafio:</strong> Você precisa gerar tráfego próprio (redes sociais, anúncios, indicações).
                    A estratégia ideal é usar marketplaces para adquirir clientes e converter para vendas diretas via Pix.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-4">
                <AccordionTrigger>
                  Qual a diferença entre MEI e Simples Nacional para e-commerce?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    A diferença principal está no <strong>limite de faturamento</strong> e na <strong>forma de tributação</strong>:
                  </p>
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="font-semibold text-green-700 mb-2">MEI (Microempreendedor Individual)</p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Limite: R$ 81.000/ano (~R$ 6.750/mês)</li>
                        <li>• Imposto: <strong>Fixo R$ 81,05/mês</strong> (DAS)</li>
                        <li>• Não varia com faturamento</li>
                        <li>• Ideal para: Iniciantes ou pequenos vendedores</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="font-semibold text-blue-700 mb-2">Simples Nacional (Anexo I - Comércio)</p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Limite: R$ 81.000 a R$ 4,8 milhões/ano</li>
                        <li>• Imposto: <strong>4% a 11,35%</strong> sobre cada venda</li>
                        <li>• Varia com faturamento acumulado</li>
                        <li>• Ideal para: Vendedores em crescimento</li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-3 text-sm bg-blue-50 p-3 rounded">
                    <strong>Quando migrar?</strong> Se você está faturando próximo aos R$ 6.500/mês e tem margem de lucro acima de 20%,
                    considere migrar para Simples Nacional para ter espaço de crescimento. Porém, faça as contas com um contador,
                    pois o Simples pode reduzir sua margem em 4-6% por venda.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-5">
                <AccordionTrigger>
                  O que é &quot;Ponto de Equilíbrio&quot; na calculadora?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    O <strong>ponto de equilíbrio</strong> (também chamado de &quot;preço de custo&quot; ou &quot;break-even&quot;) é o preço mínimo que você precisa vender para <strong>não ter prejuízo</strong>. É quando seu lucro é exatamente R$ 0,00.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                    <p className="text-sm font-semibold text-blue-900 mb-1">📌 Em outras palavras:</p>
                    <p className="text-sm text-blue-800">
                      É o valor que cobre todos os seus custos (produto + embalagem + frete + taxas + impostos), mas não dá lucro nem prejuízo.
                    </p>
                  </div>
                  <p className="mb-2">
                    <strong>Por que é importante conhecer?</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4 mb-3">
                    <li>Define seu <strong>preço mínimo</strong> em promoções e liquidações</li>
                    <li>Ajuda a negociar com clientes sem ter prejuízo</li>
                    <li>Permite liquidar estoque parado sem perder dinheiro</li>
                    <li>Mostra se um produto é viável de vender naquele marketplace</li>
                  </ul>
                  <p className="text-sm bg-gray-50 p-3 rounded mb-2">
                    <strong>Exemplo prático:</strong> Se seu ponto de equilíbrio é R$ 80 e você vende por R$ 100,
                    você tem R$ 20 de &quot;margem de segurança&quot;. Isso significa que pode dar até 20% de desconto (R$ 20) sem ter prejuízo.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    💡 <strong>Dica:</strong> Sempre venda acima do ponto de equilíbrio! Vender abaixo significa operar no prejuízo.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="por-que-usar" className="bg-green-50 rounded-xl border-2 border-green-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Por que usar esta calculadora profissional?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Atualizada com Taxas de Março 2026</h3>
                <p className="text-gray-700 text-sm">
                  Todas as taxas e regras dos marketplaces brasileiros verificadas e atualizadas mensalmente.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ 100% Gratuita e Sem Limites</h3>
                <p className="text-gray-700 text-sm">
                  Sem cadastro, sem limite de uso, sem anúncios invasivos. Use quantas vezes precisar.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Cálculo Completo e Profissional</h3>
                <p className="text-gray-700 text-sm">
                  Considera todas as taxas, impostos MEI/Simples, custos operacionais e ponto de equilíbrio.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Compartilhamento Fácil</h3>
                <p className="text-gray-700 text-sm">
                  Envie o resumo completo direto para o WhatsApp da sua equipe ou contador com um clique.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Suporte a 4 Canais</h3>
                <p className="text-gray-700 text-sm">
                  Compare lado a lado: Shopee, Mercado Livre Clássico, Mercado Livre Premium e Pix.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Responsiva e Rápida</h3>
                <p className="text-gray-700 text-sm">
                  Funciona perfeitamente em celular, tablet e desktop. Cálculos instantâneos em tempo real.
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
            Esta calculadora é uma ferramenta educacional desenvolvida por especialistas em e-commerce.
            Consulte sempre um contador para orientações específicas sobre impostos e enquadramento fiscal.
          </p>
          <p className="text-gray-600 text-xs mt-3">
            Última atualização das taxas: <strong className="text-green-400">Março de 2026</strong>
          </p>
        </div>
      </footer>
    </main>
  );
}
