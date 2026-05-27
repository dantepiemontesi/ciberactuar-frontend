'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, ArrowRight, CheckCircle2, XCircle, TrendingDown, Zap } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { GaugeScore } from '@/components/gauge-score'

const SEVERITY_COLORS = {
  critical: { bg: 'bg-red-950', border: 'border-red-800', text: 'text-red-400', badge: 'bg-red-900 text-red-300' },
  high: { bg: 'bg-orange-950', border: 'border-orange-800', text: 'text-orange-400', badge: 'bg-orange-900 text-orange-300' },
  medium: { bg: 'bg-amber-950', border: 'border-amber-800', text: 'text-amber-400', badge: 'bg-amber-900 text-amber-300' },
  low: { bg: 'bg-blue-950', border: 'border-blue-800', text: 'text-blue-400', badge: 'bg-blue-900 text-blue-300' },
}

const SEVERITY_LABELS = { critical: 'Crítica', high: 'Alta', medium: 'Media', low: 'Baja' }

export default function MitigationPage() {
  const router = useRouter()
  const { scanResult } = useStore()
  const [fixedVulns, setFixedVulns] = useState<Set<string>>(new Set())
  const [currentScore, setCurrentScore] = useState(0)
  const [currentPremium, setCurrentPremium] = useState(0)

  useEffect(() => {
    if (!scanResult) {
      router.push('/')
      return
    }
    setCurrentScore(scanResult.cyberScore)
    setCurrentPremium(scanResult.recommendedPremium)
  }, [scanResult, router])

  if (!scanResult) return null

  const { vulnerabilities, cyberScore, recommendedPremium } = scanResult

  const handleToggle = (vulnId: string, premiumReduction: number, scoreImpact: number) => {
    const newFixed = new Set(fixedVulns)
    if (newFixed.has(vulnId)) {
      newFixed.delete(vulnId)
      setCurrentScore(Math.max(0, currentScore - scoreImpact))
      setCurrentPremium(Math.min(recommendedPremium, currentPremium + premiumReduction))
    } else {
      newFixed.add(vulnId)
      setCurrentScore(Math.min(100, currentScore + scoreImpact))
      setCurrentPremium(Math.max(5, currentPremium - premiumReduction))
    }
    setFixedVulns(newFixed)
  }

  const totalSavings = recommendedPremium - currentPremium
  const scoreImprovement = currentScore - cyberScore

  return (
    <main className="min-h-screen bg-slate-950 pb-12">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-7 w-7 text-blue-400" />
            <span className="text-lg font-bold text-white">CiberActuar</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-sm">Plan de Mitigación</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard/overview')}
              className="flex items-center gap-2 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        {/* Live Score Panel */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Tu Cyber Score actual</p>
              <GaugeScore score={currentScore} size="sm" />
              {scoreImprovement > 0 && (
                <p className="text-emerald-400 text-sm mt-2 flex items-center justify-center gap-1">
                  <TrendingDown className="h-4 w-4 rotate-180" />
                  +{scoreImprovement} puntos ganados
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Prima mensual</p>
              <p className="text-4xl font-bold text-blue-400">${currentPremium} <span className="text-base font-normal text-slate-400">USD/mes</span></p>
              {totalSavings > 0 && (
                <p className="text-emerald-400 text-sm mt-2">
                  Ahorrás ${totalSavings} USD/mes ✅
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Vulnerabilidades resueltas</p>
              <p className="text-4xl font-bold text-white">{fixedVulns.size}<span className="text-slate-400 text-lg">/{vulnerabilities.length}</span></p>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(fixedVulns.size / vulnerabilities.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-950 border border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-200 font-medium">¿Cómo funciona?</p>
            <p className="text-blue-300 text-sm mt-1">
              Cada vez que marcás una vulnerabilidad como resuelta, tu Cyber Score sube y el precio de tu póliza baja automáticamente. ¡Más seguridad = menos costo!
            </p>
          </div>
        </div>

        {/* Vulnerability List */}
        <div className="space-y-4">
          {vulnerabilities
            .sort((a, b) => {
              const order = { critical: 0, high: 1, medium: 2, low: 3 }
              return order[a.severity] - order[b.severity]
            })
            .map((vuln) => {
              const isFixed = fixedVulns.has(vuln.id)
              const colors = SEVERITY_COLORS[vuln.severity]
              
              return (
                <div
                  key={vuln.id}
                  className={`border rounded-2xl p-5 transition-all duration-300 ${
                    isFixed ? 'bg-emerald-950 border-emerald-800' : `bg-slate-900 ${colors.border}`
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isFixed ? 'bg-emerald-900 text-emerald-300' : colors.badge}`}>
                          {isFixed ? '✅ RESUELTO' : SEVERITY_LABELS[vuln.severity].toUpperCase()}
                        </span>
                        {vuln.port && (
                          <span className="text-slate-500 text-xs font-mono">Puerto {vuln.port}</span>
                        )}
                      </div>
                      <h3 className={`font-semibold text-lg mb-1 ${isFixed ? 'text-emerald-300 line-through' : 'text-white'}`}>
                        {vuln.title}
                      </h3>
                      <p className="text-slate-400 text-sm">{vuln.description}</p>
                      {!isFixed && (
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-red-400 text-sm">
                            💰 Exposición: ${vuln.impact.toLocaleString()} USD
                          </span>
                          <span className="text-emerald-400 text-sm">
                            📉 Al resolver: -${vuln.premiumReduction} USD/mes
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggle(vuln.id, vuln.premiumReduction, Math.ceil(vuln.premiumReduction / 2))}
                      className={`relative flex-shrink-0 w-14 h-7 rounded-full transition-colors duration-300 ${
                        isFixed ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                        isFixed ? 'translate-x-7' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              )
            })}
        </div>

        {/* CTA */}
        {fixedVulns.size > 0 && (
          <div className="mt-8 bg-emerald-950 border border-emerald-800 rounded-2xl p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">
              ¡Estás mejorando tu seguridad!
            </h3>
            <p className="text-slate-400 mb-4">
              Con las {fixedVulns.size} mejoras marcadas, tu póliza baja de ${recommendedPremium} a ${currentPremium} USD/mes
            </p>
            <button
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              onClick={() => alert('Función de contratación próximamente')}
            >
              Contratar póliza a ${currentPremium} USD/mes ⚡
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
