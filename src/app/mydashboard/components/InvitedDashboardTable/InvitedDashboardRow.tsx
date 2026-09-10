'use client'

import { useState } from 'react'

import { showError, showSuccess } from '@/app/shared/lib/toast'
import { Invitation } from '@/app/shared/types/dashboard'

import { useRespondToInvitation } from '../../hooks/useMyDashboards'

interface InvitedDashboardRowProps {
  invitation: Invitation
}

export default function InvitedDashboardRow({
  invitation,
}: InvitedDashboardRowProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const respondToInvitationMutation = useRespondToInvitation()

  // 공통 초대 응답 처리
  const handleInvitationResponse = async (accept: boolean) => {
    if (isProcessing) return

    const action = accept ? '수락' : '거절'
    setIsProcessing(true)

    try {
      await respondToInvitationMutation.mutateAsync({
        invitationId: invitation.id,
        accept,
      })

      const successMessage = accept
        ? '초대를 수락했습니다!'
        : '초대를 거절했습니다.'
      showSuccess(successMessage)
    } catch (error) {
      console.error(`초대 ${action} 실패:`, error)

      const errorMessage =
        error instanceof Error
          ? `초대 ${action} 실패: ${error.message}`
          : `초대 ${action} 중 오류가 발생했습니다.`

      showError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAccept = () => handleInvitationResponse(true)
  const handleReject = () => handleInvitationResponse(false)

  return (
    <>
      {/* 데스크톱/태블릿 테이블 레이아웃 */}
      <div className="grid grid-cols-3 items-center gap-20 border-b border-gray-100 py-20 pl-36 pr-32 mobile-wide:hidden">
        {/* 대시보드 이름 */}
        <span className="Text-black text-16">
          {invitation.dashboard.title || '제목 없음'}
        </span>

        {/* 초대자 */}
        <span className="Text-black text-center text-16">
          {invitation.inviter.nickname || invitation.inviter.email}
        </span>

        {/* 수락/거절 버튼들 */}
        <div className="flex items-center justify-center gap-10">
          <button
            onClick={handleAccept}
            disabled={isProcessing}
            className="BG-blue flex h-32 w-70 items-center justify-center rounded-8 text-14 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 tablet-wide:h-30 tablet-wide:w-72 tablet-wide:text-12"
          >
            {isProcessing ? '처리 중' : '수락'}
          </button>
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="BG-white Border-blue Text-blue flex h-32 w-70 items-center justify-center rounded-8 border text-14 font-medium transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 tablet-wide:h-30 tablet-wide:w-72 tablet-wide:text-12"
          >
            {isProcessing ? '처리 중' : '거절'}
          </button>
        </div>
      </div>

      {/* 모바일 카드 레이아웃 */}
      <div className="mb-12 hidden rounded-8 p-16 mobile-wide:block">
        {/* 이름 */}
        <div className="mb-8 flex items-center gap-8">
          <span className="Text-gray-light text-14 font-medium">이름</span>
          <span className="Text-black text-14">
            {invitation.dashboard.title || '제목 없음'}
          </span>
        </div>

        {/* 초대자 */}
        <div className="mb-12 flex items-center gap-8">
          <span className="Text-gray-light text-14 font-medium">초대자</span>
          <span className="Text-black text-14">
            {invitation.inviter.nickname || invitation.inviter.email}
          </span>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-8">
          <button
            onClick={handleAccept}
            disabled={isProcessing}
            className="BG-blue flex h-32 w-109 items-center justify-center rounded-8 text-12 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? '처리 중' : '수락'}
          </button>
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="BG-white Border-blue Text-blue flex h-32 w-109 items-center justify-center rounded-8 border text-12 font-medium transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? '처리 중' : '거절'}
          </button>
        </div>
      </div>
    </>
  )
}
