'use client'

import Header from '@components/common/header/Header'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import Sidebar from '@/app/shared/components/common/sidebar/Sidebar'
import { useDashboard } from '@/app/shared/hooks/useDashboard'
import { useDashboardDetail } from '@/app/shared/hooks/useDashboardDetail'
import { useSelectedDashboardStore } from '@/app/shared/store/useSelectedDashboardStore'

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams<{ id: string }>()
  const dashboardId = Number(params.id)
  const router = useRouter()

  const { data: dashboards } = useDashboard()
  const { setSelectedDashboard } = useSelectedDashboardStore()

  const foundInList = dashboards?.find((d) => d.id === dashboardId)

  // 목록 캐시에 없을 때만 단건 조회 (있으면 0을 넘겨서 enabled:false로 요청 스킵)
  const { data: detail, isError } = useDashboardDetail(
    !foundInList && dashboards ? dashboardId : 0,
  )

  useEffect(() => {
    if (foundInList) {
      setSelectedDashboard(foundInList)
    } else if (detail) {
      setSelectedDashboard(detail)
    } else if (isError) {
      // 삭제된 대시보드로 진입 시도 → mydashboard로 리다이렉트
      setSelectedDashboard(null)
      router.replace('/mydashboard')
    }
  }, [foundInList, detail, isError, router, setSelectedDashboard])

  return (
    <>
      <Sidebar />
      <div className="pl-300 transition-all duration-300 mobile:pl-67 tablet:pl-150">
        <Header />
        <main className="pt-57">{children}</main>
      </div>
    </>
  )
}
