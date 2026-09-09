'use client'

import { useModalStore } from '@store/useModalStore'
import React, { useEffect } from 'react'

import { useDashboardForm } from '@/app/shared/hooks/useDashboardForm'

import DashboardForm from '../../dashboard/DashboardForm'

export default function CreateDashboardModal() {
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
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitText="생성"
          showCancelButton
          onCancel={closeModal}
        />
      </div>
    </div>
  )
}
