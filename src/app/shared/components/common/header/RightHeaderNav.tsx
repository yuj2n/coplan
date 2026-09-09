'use client'

import { useModalStore } from '@store/useModalStore'
import { useParams, usePathname } from 'next/navigation'

import NavItem from './NavItem'

export default function RightHeaderNav() {
  const { openModal } = useModalStore()
  const pathname = usePathname()
  const params = useParams<{ id?: string }>()

  const isMyDashboardPage = pathname === '/mydashboard'

  return (
    <nav className="Text-black flex gap-6 whitespace-nowrap text-sm">
      {!isMyDashboardPage && params.id && (
        <>
          <NavItem
            as="link"
            href={`/dashboard/${params.id}/edit`}
            iconSrc="/images/config.svg"
            label="관리"
          />
          <NavItem
            as="button"
            onClick={() => openModal('invite')}
            iconSrc="/images/invitation.png"
            label="초대"
          />
        </>
      )}
    </nav>
  )
}
