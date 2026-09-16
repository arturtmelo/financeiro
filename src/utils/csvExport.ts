import { Transaction } from '../types';

const escapeCsvValue = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const transactionsToCsv = (transactions: Transaction[]): string => {
  const headers = ['Data', 'Descrição', 'Tipo', 'Valor', 'Método de Pagamento', 'Categoria'];
  const rows = transactions.map((t) => [
    t.date,
    t.description,
    t.type === 'entrada' ? 'Entrada' : 'Saída',
    t.amount.toFixed(2).replace('.', ','),
    t.paymentMethod,
    t.category || '',
  ]);

  const lines = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(','));
  return lines.join('\n');
};

export const downloadCsv = (filename: string, content: string): void => {
  // BOM (﻿) garante que acentuação (pt-BR) abra corretamente no Excel
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadTransactionsCsv = (transactions: Transaction[]): void => {
  const csv = transactionsToCsv(transactions);
  const today = new Date().toISOString().split('T')[0];
  downloadCsv(`transacoes_${today}.csv`, csv);
};
