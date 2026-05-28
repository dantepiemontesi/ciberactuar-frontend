# 🛡️ CiberActuar — Frontend Dashboard

> **Plataforma de Ciberseguro para PyMEs** — Transforma el riesgo digital en decisiones financieras simples.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-2.12-ff6384?style=flat-square)

---

## 🎯 ¿Qué es CiberActuar?

CiberActuar es una SPA (Single Page Application) que permite a los dueños de PyMEs:

1. **Escanear** el dominio de su empresa para detectar vulnerabilidades
2. **Ver** su riesgo financiero real en pesos/dólares con modelos actuariales
3. **Contratar** un ciberseguro a medida con un solo clic

---

## 🏗️ Arquitectura del Frontend

```
src/
├── app/
│   ├── layout.tsx              # Layout global (modo oscuro fijo)
│   ├── page.tsx                # Landing page con formulario de escaneo
│   └── dashboard/
│       ├── overview/page.tsx   # Dashboard de riesgo (Cyber Score + Monte Carlo)
│       └── mitigation/page.tsx # Simulador interactivo de mejoras
├── components/
│   ├── gauge-score.tsx         # Medidor visual del Cyber Score (0-100)
│   └── risk-chart.tsx          # Gráfico de distribución de Monte Carlo
├── store/
│   └── useStore.ts             # Estado global con Zustand + persistencia
└── lib/
    ├── api.ts                  # Integración con FastAPI + mock data
    └── utils.ts                # Utilidades (cn, formatCurrency, etc.)
```

---

## 🚀 Cómo levantar el proyecto

### Prerequisitos

- Node.js 18+
- npm, yarn o pnpm

### 1. Clonar el repositorio

```bash
git clone https://github.com/dantepiemontesi/ciberactuar-frontend.git
cd ciberactuar-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Editá `.env.local` con tu URL del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🎨 Stack Tecnológico

| Tecnología | Uso |
|-----------|-----|
| **Next.js 14** (App Router) | Framework principal |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Estilos (modo oscuro fijo) |
| **Shadcn/ui** | Componentes UI base |
| **Recharts** | Gráficos interactivos (Monte Carlo, Gauge) |
| **Lucide React** | Iconografía |
| **Zustand** | Estado global con persistencia |

---

## 🎨 Paleta de Colores

- **Azul Slate** (`#1e40af`) → Confianza, acción principal
- **Esmeralda** (`#10b981`) → Zona segura, éxito
- **Ámbar** (`#f59e0b`) → Alerta, riesgo medio
- **Carmesí** (`#ef4444`) → Peligro, riesgo crítico

---

## 📱 Las 3 Pantallas

### 1. Landing Page (`/`)
- Formulario de dominio con loading animado
- Llama a la API de escaneo del backend
- Redirige al dashboard al completar

### 2. Overview Dashboard (`/dashboard/overview`)
- **Cyber Score**: Medidor semicircular 0-100 con colores dinámicos
- **Impacto Financiero**: Pérdida anual en USD + gráfico Monte Carlo
- **Cotización**: Prima mensual recomendada + CTA de contratación

### 3. Simulador de Mitigación (`/dashboard/mitigation`)
- Lista de vulnerabilidades con toggle switches
- Recalcula score y prima en tiempo real al activar cada switch
- Incentivo visual: más mejoras = menor precio de póliza

---

## 🔗 Integración con Backend

El frontend se conecta al backend de FastAPI mediante:

```typescript
// src/lib/api.ts
POST /api/v1/scan        → Escanea dominio
POST /api/v1/recalculate → Recalcula riesgo con mejoras
GET  /api/v1/quote/:id   → Obtiene cotización final
```

> ⚡ **Modo Demo**: Si el backend no está disponible, el frontend usa mock data automáticamente para demostración.

---

## 🧱 Repositorios del Proyecto

| Repo | Descripción |
|------|-------------|
| [ciberactuar-frontend](https://github.com/dantepiemontesi/ciberactuar-frontend) | Este repo — Next.js SPA |
| [ciberactuar-backend](https://github.com/dantepiemontesi/ciberactuar-backend) | FastAPI + Redis + modelos actuariales |

---

## 📄 Licencia

MIT — Desarrollado con ❤️ para el ecosistema PyME
