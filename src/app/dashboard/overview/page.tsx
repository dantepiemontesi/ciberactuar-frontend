'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, TrendingUp, DollarSign, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { GaugeScore } from '@/components/gauge-score'
import { RiskChart } from '@/components/risk-chart'

export default function OverviewPage() {
  const router = useRouter()
  const { scanResult } = useStore()

  useEffect(() => {
    if (!scanResult) {
      router.push('/')
    }
  }, [scanResult, router])

  if (!scanResult) return null

  const { 
    domain, cyberScore, expectedAnnualLoss, 
    recommendedPremium, coverageAmount, 
    monteCarloData, sectorComparison, vulnerabilities 
  } = scanResult

  const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical').length
  const highVulns = vulnerabilities.filter(v => v.severity === 'high').length

  const scoreColor = cyberScore >= 70 ? 'text-emerald-400' : cyberScore >= 40 ? 'text-amber-400' : 'text-red-400'
  const scoreBgColor = cyberScore >= 70 ? 'border-emerald-500' : cyberScore >= 40 ? 'border-amber-500' : 'border-red-500'

  return (
    <main className="min-h-screen bg-slate-950 pb-12">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-7 w-7 text-blue-400" />
            <span className="text-lg font-bold text-white">CiberActuar</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono text-sm">{domain}</span>
          </div>
          <button
            onClick={() => router.push('/dashboard/mitigation')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Ver plan de mejora
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        {/* Alert banner for critical vulns */}
        {criticalVulns > 0 && (
          <div className="bg-red-950 border border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200 text-sm">
              <strong>Atención:</strong> Encontramos {criticalVulns} vulnerabilidad{criticalVulns > 1 ? 'es' : ''} crítica{criticalVulns > 1 ? 's' : ''} y {highVulns} de alto riesgo que exponen tu empresa a pérdidas inmediatas.
            </p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Card 1: Cyber Health Score */}
          <div className={`bg-slate-900 border ${scoreBgColor} rounded-2xl p-6 card-hover`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Salud Digital</h2>
              <Shield className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex items-center justify-center my-4">
              <GaugeScore score={cyberScore} />
            </div>
            <p className="text-slate-400 text-sm text-center mt-4">
              Tu empresa es{' '}
              <span className="text-amber-400 font-semibold">{sectorComparison}% más vulnerable</span>
              {' '}que el promedio del sector
            </p>
          </div>

          {/* Card 2: Financial Impact */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Impacto Financiero</h2>
              <DollarSign className="h-5 w-5 text-slate-400" />
            </div>
            <div className="text-center py-4">
              <p className="text-slate-400 text-sm mb-2">Pérdida anual esperada</p>
              <p className="text-4xl font-bold text-red-400">
                ${expectedAnnualLoss.toLocaleString()} USD
              </p>
              <p className="text-slate-500 text-xs mt-2">Calculado con modelo actuarial de Poisson</p>
            </div>
            <div className="mt-4 h-32">
              <RiskChart data={monteCarloData} />
            </div>
            <p className="text-slate-500 text-xs text-center mt-2">
              Simulación Monte Carlo — distribución de pérdidas posibles
            </p>
          </div>

          {/* Card 3: Insurance Quote */}
          <div className="bg-slate-900 border border-blue-800 rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Tu Cotización</h2>
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-center py-4">
              <p className="text-slate-400 text-sm mb-2">Póliza recomendada</p>
              <p className="text-5xl font-bold text-blue-400">
                ${recommendedPremium}
                <span className="text-lg font-normal text-slate-400"> USD/mes</span>
              </p>
              <div className="bg-slate-800 rounded-xl p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-slate-300 text-sm">Cobertura total hasta</span>
                </div>
                <p className="text-2xl font-bold text-emerald-400">
                  ${coverageAmount.toLocaleString()} USD
                </p>
              </div>
            </div>
            <button 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors mt-4"
              onClick={() => alert('Función de contratación próximamente')}
            >
              Contratar Seguro con un Clic ⚡
            </button>
          </div>
        </div>

        {/* Vulnerabilities Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-lg">Vulnerabilidades Encontradas</h2>
            <button
              onClick={() => router.push('/dashboard/mitigation')}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            >
              Ver plan completo <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['critical', 'high', 'medium', 'low'] as const).map((severity) => {
              const count = vulnerabilities.filter(v => v.severity === severity).length
              const colors = {
                critical: 'bg-red-950 border-red-800 text-red-400',
                high: 'bg-orange-950 border-orange-800 text-orange-400',
                medium: 'bg-amber-950 border-amber-800 text-amber-400',
                low: 'bg-blue-950 border-blue-800 text-blue-400',
              }
              const labels = { critical: 'Críticas', high: 'Altas', medium: 'Medias', low: 'Bajas' }
              return (
                <div key={severity} className={`${colors[severity]} border rounded-xl p-4 text-center`}>
                  <p className="text-3xl font-bold">{count}</p>
                  <p className="text-slate-400 text-sm mt-1">{labels[severity]}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
