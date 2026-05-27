import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CiberActuar - Seguro de Ciberseguridad para PyMEs',
  description: 'Protegé tu empresa de ataques cibernéticos. Calculamos tu riesgo real y te ofrecemos el seguro perfecto para tu negocio.',
  keywords: ['ciberseguro', 'ciberseguridad', 'PyME', 'seguro digital', 'protección empresarial'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          {children}
        </div>
      </body>
    </html>
  )
}
