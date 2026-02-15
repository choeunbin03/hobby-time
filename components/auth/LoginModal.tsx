"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginButton } from "./LoginButton"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  description?: string
}

export function LoginModal({ 
  open, 
  onOpenChange,
  description = "이 기능을 사용하시려면 로그인이 필요합니다."
}: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>로그인 필요</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <LoginButton />
        </div>
      </DialogContent>
    </Dialog>
  )
}
