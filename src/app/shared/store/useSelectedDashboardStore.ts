import { create } from 'zustand'

import { Dashboard } from '@/app/shared/types/dashboard'

type SelectedDashboardState = {
  selectedDashboard: Dashboard | null
  setSelectedDashboard: (dashboard: Dashboard | null) => void
}

export const useSelectedDashboardStore = create<SelectedDashboardState>(
  (set) => ({
    selectedDashboard: null,
    setSelectedDashboard: (dashboard) => set({ selectedDashboard: dashboard }),
  }),
)
