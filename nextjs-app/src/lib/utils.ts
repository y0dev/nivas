import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function calculateROI(purchasePrice: number, monthlyRent: number, monthlyExpenses: number): number {
  const annualRent = monthlyRent * 12
  const annualExpenses = monthlyExpenses * 12
  const annualProfit = annualRent - annualExpenses
  return annualProfit / purchasePrice
}

export function calculateCashOnCashReturn(purchasePrice: number, downPayment: number, monthlyRent: number, monthlyExpenses: number): number {
  const annualRent = monthlyRent * 12
  const annualExpenses = monthlyExpenses * 12
  const annualProfit = annualRent - annualExpenses
  return annualProfit / downPayment
} 