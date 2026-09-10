// src/app/features/dashboard/api/invitation.ts
import authHttpClient from '@api/axios'

type InvitationRequest = {
  email: string
  dashboardId: number | string
}

export const inviteUser = async ({ email, dashboardId }: InvitationRequest) => {
  const response = await authHttpClient.post(
    `/${process.env.NEXT_PUBLIC_TEAM_ID}/dashboards/${dashboardId}/invitations`,
    {
      email,
    },
  )
  return response.data
}

// 초대 목록 조회(중복 체크)
export const getInvitations = async (dashboardId: number | string) => {
  const response = await authHttpClient.get(
    `/${process.env.NEXT_PUBLIC_TEAM_ID}/dashboards/${dashboardId}/invitations`,
  )
  return response.data.invitations as {
    id: number
    invitee: { email: string }
  }[]
}
