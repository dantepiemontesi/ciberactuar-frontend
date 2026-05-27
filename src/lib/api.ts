const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Vulnerability {
  id: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  port?: number
  impact: number
  premiumReduction: number
  fixed: boolean
}

export interface MonteCarloPoint {
  loss: number
  probability: number
}

export interface ScanResult {
  domain: string
  cyberScore: number
  expectedAnnualLoss: number
  recommendedPremium: number
  coverageAmount: number
  vulnerabilities: Vulnerability[]
  monteCarloData: MonteCarloPoint[]
  sectorComparison: number
}

// Mock data for development/demo
function generateMockScanResult(domain: string): ScanResult {
  const score = Math.floor(Math.random() * 60) + 20 // 20-80
  const annualLoss = Math.floor(Math.random() * 30000) + 5000
  const premium = Math.floor(annualLoss / 300)
  
  return {
    domain,
    cyberScore: score,
    expectedAnnualLoss: annualLoss,
    recommendedPremium: premium,
    coverageAmount: 100000,
    sectorComparison: Math.floor(Math.random() * 40) + 40,
    vulnerabilities: [
      {
        id: 'rdp-open',
        title: 'Puerto RDP 3389 expuesto a Internet',
        description: 'El escritorio remoto está abierto al público, lo que permite ataques de fuerza bruta.',
        severity: 'critical',
        port: 3389,
        impact: 15000,
        premiumReduction: 8,
        fixed: false,
      },
      {
        id: 'no-dmarc',
        title: 'Sin protección DMARC en correo',
        description: 'Tu dominio no tiene DMARC configurado, permitiendo que alguien envíe emails haciéndose pasar por tu empresa.',
        severity: 'high',
        port: undefined,
        impact: 8000,
        premiumReduction: 5,
        fixed: false,
      },
      {
        id: 'ssl-outdated',
        title: 'Certificado SSL desactualizado',
        description: 'El certificado SSL está por vencer en menos de 30 días, dejando las comunicaciones en riesgo.',
        severity: 'high',
        port: 443,
        impact: 5000,
        premiumReduction: 4,
        fixed: false,
      },
      {
        id: 'no-2fa',
        title: 'Sin autenticación de dos factores en panel admin',
        description: 'El panel administrativo no requiere un segundo factor de autenticación.',
        severity: 'medium',
        port: undefined,
        impact: 3000,
        premiumReduction: 3,
        fixed: false,
      },
      {
        id: 'weak-headers',
        title: 'Headers de seguridad HTTP faltantes',
        description: 'Faltan headers como Content-Security-Policy y X-Frame-Options que protegen contra ataques XSS.',
        severity: 'low',
        port: undefined,
        impact: 1000,
        premiumReduction: 1,
        fixed: false,
      },
    ],
    monteCarloData: Array.from({ length: 20 }, (_, i) => ({
      loss: i * (annualLoss * 0.15),
      probability: Math.exp(-Math.pow(i - 6, 2) / 10) * 0.3,
    })),
  }
}

export async function scanDomain(domain: string): Promise<ScanResult> {
  // Add artificial delay for UX
  await new Promise(r => setTimeout(r, 2500))
  
  try {
    const response = await fetch(`${API_URL}/api/v1/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
    })
    if (!response.ok) throw new Error('Backend not available')
    return response.json()
  } catch {
    // Fallback to mock data when backend is not available
    console.warn('Backend unavailable, using mock data')
    return generateMockScanResult(domain)
  }
}

export async function recalculateRisk(
  domain: string,
  fixedVulnerabilities: string[]
): Promise<{ newScore: number; newPremium: number; newExpectedLoss: number }> {
  try {
    const response = await fetch(`${API_URL}/api/v1/recalculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, fixed_vulnerabilities: fixedVulnerabilities }),
    })
    if (!response.ok) throw new Error('Failed')
    return response.json()
  } catch {
    return { newScore: 75, newPremium: 30, newExpectedLoss: 8000 }
  }
}
