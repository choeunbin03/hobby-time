"use client"

import { useState } from "react"
import Link from "next/link"
import { User } from "@supabase/supabase-js"
import { LoginModal } from "@/components/auth/LoginModal"

interface MyReservationsLinkProps {
  user: User | null
}

export function MyReservationsLink({ user }: MyReservationsLinkProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      setShowLoginModal(true)
    }
  }

  return (
    <>
      <Link 
        href="/my/reservations" 
        className="transition-colors hover:text-foreground/80 text-foreground/60"
        onClick={handleClick}
      >
        내 예약
      </Link>
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        description="예약 내역을 확인하시려면 로그인이 필요합니다."
      />
    </>
  )
}
