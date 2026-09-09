// hooks/useDashboardForm.ts
import authHttpClient from '@api/axios'
import { DASHBOARD_COLORS } from '@constants/colors'
import { getTeamId } from '@lib/getTeamId'
import { showError, showSuccess } from '@lib/toast'
import { useModalStore } from '@store/useModalStore'
import { useSelectedDashboardStore } from '@store/useSelectedDashboardStore'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { CreateDashboardRequest } from '@/types/dashboard'

type Mode = 'create' | 'edit'

const teamId = getTeamId()

export function useDashboardForm(mode: Mode) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { closeModal } = useModalStore() // 모달 제어 함수
  const { selectedDashboard, setSelectedDashboard } =
    useSelectedDashboardStore()

  const [formData, setFormData] = useState<CreateDashboardRequest>({
    title: '',
    color: DASHBOARD_COLORS[0],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (mode === 'edit' && selectedDashboard) {
      setFormData({
        title: selectedDashboard.title,
        color: selectedDashboard.color,
      })
    }
  }, [mode, selectedDashboard])

  // 대시보드 생성 모달 폼 초기화
  const resetForm = () => {
    setFormData({
      title: '',
      color: DASHBOARD_COLORS[0],
    })
    setIsSubmitting(false)
  }

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 색상 선택 핸들러
  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }))
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title || !formData.color) return

    try {
      setIsSubmitting(true)

      if (mode === 'create') {
        const response = await authHttpClient.post(
          `/${teamId}/dashboards`,
          formData,
        )

        showSuccess('대시보드가 생성되었습니다.')

        // 사이드바 & 내 대시보드 쿼리 무효화
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['dashboards'] }),
          queryClient.invalidateQueries({ queryKey: ['myDashboards'] }),
        ])

        // 성공했을 때만 모달 닫고 이동
        closeModal()
        router.push(`/dashboard/${response.data.id}`)
      } else if (mode === 'edit' && selectedDashboard?.id) {
        const response = await authHttpClient.put(
          `/${teamId}/dashboards/${selectedDashboard.id}`,
          formData,
        )
        const data = response.data
        setSelectedDashboard(data)

        showSuccess('대시보드 정보가 수정되었습니다.')
        await queryClient.invalidateQueries({ queryKey: ['dashboards'] })
        router.refresh()

        closeModal()
        router.push(`/dashboard/${data.id}/edit`)
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          '대시보드 요청 중 오류가 발생했습니다.'
        : '알 수 없는 오류가 발생했습니다.'
      showError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    isSubmitting,
    handleChange,
    handleColorSelect,
    handleSubmit,
    resetForm,
    selectedDashboard,
  }
}
