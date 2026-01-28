import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <span className="text-xs font-semibold text-primary-foreground">H</span>
              </div>
              <span className="text-sm font-semibold text-foreground">Hobby Time</span>
            </div>
            <p className="text-sm text-muted-foreground">
              다양한 취미 클래스를 탐색하고 예약하세요
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">메뉴</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  클래스 탐색
                </Link>
              </li>
              <li>
                <Link
                  href="/my-reservations"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  내 예약
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">정보</h3>
            <p className="text-sm text-muted-foreground">
              취미 클래스 예약 플랫폼
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Hobby Time. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
