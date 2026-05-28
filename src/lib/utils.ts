import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getScoreLevel(score: number): 'safe' | 'warning' | 'danger' {
  if (score >= 70) return 'safe'
  if (score >= 40) return 'warning'
  return 'danger'
}

export function getScoreColor(score: number): string {
  const level = getScoreLevel(score)
  return {
    safe: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  }[level]
}
