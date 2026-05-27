import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ScanResult } from '@/lib/api'

interface AppState {
  scanResult: ScanResult | null
  isLoading: boolean
  setScanResult: (result: ScanResult) => void
  setLoading: (loading: boolean) => void
  clearScanResult: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      scanResult: null,
      isLoading: false,
      setScanResult: (result) => set({ scanResult: result }),
      setLoading: (loading) => set({ isLoading: loading }),
      clearScanResult: () => set({ scanResult: null }),
    }),
    {
      name: 'ciberactuar-storage',
      partialize: (state) => ({ scanResult: state.scanResult }),
    }
  )
)
