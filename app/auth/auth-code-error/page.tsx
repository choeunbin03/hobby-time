
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthCodeError() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">인증 오류</h1>
      <p className="text-muted-foreground">
        로그인 처리 중 문제가 발생했습니다. 다시 시도해 주세요.
      </p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  )
}
