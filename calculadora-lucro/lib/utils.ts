/**
 * Utilitários para formatação brasileira
 */

/**
 * Formata número como moeda brasileira (R$ 1.234,56)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formata percentual (12,34%)
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

/**
 * Parse string de moeda brasileira para número
 * Aceita: "1.234,56", "1234,56", "R$ 1.234,56"
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove "R$", espaços e pontos (separador de milhar)
  const cleaned = value
    .replace(/R\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.'); // Troca vírgula por ponto
  
  return parseFloat(cleaned) || 0;
}

/**
 * Formata input enquanto usuário digita
 */
export function formatCurrencyInput(value: string): string {
  const num = parseCurrency(value);
  if (isNaN(num)) return '';
  
  // Formata apenas se houver valor
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Valida se é um número válido e positivo
 */
export function isValidPositiveNumber(value: number): boolean {
  return !isNaN(value) && isFinite(value) && value >= 0;
}

/**
 * Classe helper para mesclar classes Tailwind
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

