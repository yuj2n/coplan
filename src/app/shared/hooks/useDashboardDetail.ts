'use client'

import authHttpClient from '@api/axios'
import { useQuery } from '@tanstack/react-query'

import { Dashboard } from '@/types/dashboard'

export const useDashboardDetail = (dashboardId: number) => {
  return useQuery({
    queryKey: ['dashboard', dashboardId],
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_TEAM_ID) {
        throw new Error('NEXT_PUBLIC_TEAM_ID 환경변수가 설정되지 않았습니다.')
      }
      const res = await authHttpClient.get<Dashboard>(
        `/${process.env.NEXT_PUBLIC_TEAM_ID}/dashboards/${dashboardId}`,
      )
      return res.data
    },
    enabled: !!dashboardId,
    staleTime: 1000 * 60,
    retry: false,
  })
}
