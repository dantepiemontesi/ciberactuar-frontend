'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Search, AlertTriangle, TrendingUp, Lock } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { scanDomain } from '@/lib/api'

export default function HomePage() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const setScanResult = useStore((s) => s.setScanResult)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) return
    setLoading(true)
    setError('')
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
      const result = await scanDomain(cleanDomain)
      setScanResult(result)
      router.push('/dashboard/overview')
    } catch (err) {
      setError('No pudimos escanear ese dominio. Verificá que sea válido e intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold text-white">CiberActuar</span>
          <span className="text-slate-400 text-sm ml-2">Protección digital para empresas</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-3xl w-full text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-950 border border-blue-800 rounded-full px-4 py-2 mb-8">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-blue-200 text-sm">87% de las PyMEs son vulnerables a ciberataques</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            ¿Cuánto dinero estás
            <span className="text-blue-400"> arriesgando</span> hoy?
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Ingresá el dominio de tu empresa y en segundos te decimos cuál es tu riesgo financiero real y cuánto te costaría protegerte.
          </p>

          {/* Search Form */}
          <form onSubmit={handleScan} className="relative max-w-2xl mx-auto">
            <div className="flex gap-3 p-2 bg-slate-900 border border-slate-700 rounded-2xl focus-within:border-blue-500 transition-colors">
              <div className="flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="miempresa.com"
                className="flex-1 bg-transparent text-white text-lg placeholder-slate-500 outline-none py-3"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !domain.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analizando...
                  </span>
                ) : (
                  'Calcular mi riesgo'
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-3 text-left pl-4">{error}</p>
            )}
          </form>

          {/* Loading skeleton */}
          {loading && (
            <div className="mt-8 max-w-2xl mx-auto space-y-3">
              <div className="h-4 bg-slate-800 rounded animate-pulse" />
              <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4 mx-auto" />
              <div className="h-4 bg-slate-800 rounded animate-pulse w-1/2 mx-auto" />
              <p className="text-slate-500 text-sm mt-4">
                Ejecutando diagnóstico de seguridad y modelo actuarial...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 card-hover">
            <div className="h-12 w-12 bg-blue-950 rounded-xl flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Diagnóstico Instantáneo</h3>
            <p className="text-slate-400">Escaneamos tu infraestructura digital y encontramos vulnerabilidades en segundos.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 card-hover">
            <div className="h-12 w-12 bg-amber-950 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Simulación Financiera</h3>
            <p className="text-slate-400">Calculamos en dinero real cuánto podrías perder ante un ataque con modelos actuariales.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 card-hover">
            <div className="h-12 w-12 bg-emerald-950 rounded-xl flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Seguro a Medida</h3>
            <p className="text-slate-400">Contratá el ciberseguro exacto que necesitás, al precio justo para tu nivel de riesgo.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
