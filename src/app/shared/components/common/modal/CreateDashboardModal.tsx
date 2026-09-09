'use client'

import { useModalStore } from '@store/useModalStore'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'

import { useDashboardForm } from '@/app/shared/hooks/useDashboardForm'

import DashboardForm from '../../dashboard/DashboardForm'

export default function CreateDashboardModal() {
  const queryClient = useQueryClient()
  const { modalType, closeModal } = useModalStore()
  const isModalOpen = modalType === 'createDashboard'

  const {
    formData,
    isSubmitting,
    handleChange,
    handleColorSelect,
    handleSubmit,
    resetForm,
  } = useDashboardForm('create')

  // 모달 닫힐 때 form 초기화
  useEffect(() => {
    if (!isModalOpen) {
      resetForm()
    }
  }, [isModalOpen, resetForm])

  if (!isModalOpen) return null

  // 쿼리 무효화 포함한 제출 핸들러
  const handleSubmitWithInvalidation = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    // 원래 handleSubmit 실행
    await handleSubmit(e)

    // 사이드바 무한스크롤 쿼리 무효화
    queryClient.invalidateQueries({
      queryKey: ['dashboards'],
    })

    // 내 대시보드 페이지 쿼리 무효화
    queryClient.invalidateQueries({
      queryKey: ['myDashboards'],
    })
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="BG-white h-344 w-584 rounded-16 p-32 mobile:h-312 mobile:w-327 mobile:px-20 mobile:py-16">
        <h2 className="Text-black mb-24 text-24 font-bold mobile:text-20">
          새로운 대시보드
        </h2>
        <DashboardForm
          formData={formData}
          onChange={handleChange}
          onColorSelect={handleColorSelect}
          onSubmit={(e) => {
            handleSubmitWithInvalidation(e)
            closeModal()
          }}
          isSubmitting={isSubmitting}
          submitText="생성"
          showCancelButton
          onCancel={closeModal}
        />
      </div>
    </div>
  )
}
