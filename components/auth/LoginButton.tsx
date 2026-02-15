
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function LoginButton() {
  const pathname = usePathname() // added

  const handleLogin = async () => {
    const supabase = createClient()
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${pathname}`, // updated
      },
    })
  }

  return (
    <Button onClick={handleLogin} variant="outline" className="gap-2">
      <LogIn className="h-4 w-4" />
      Google로 시작하기
    </Button>
  )
}
