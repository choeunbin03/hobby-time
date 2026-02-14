"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { User } from "@supabase/supabase-js";
import { LoginButton } from "@/components/auth/LoginButton";
import { UserMenu } from "@/components/auth/UserMenu";

// PRD Phase 1 기준 메뉴 구성: 클래스 탐색, 내 예약
const navItems = [
  { href: "/", label: "클래스 탐색", icon: Home },
  { href: "/my/reservations", label: "내 예약", icon: Calendar },
];

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
            <span className="text-xs font-semibold text-primary-foreground">H</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Hobby Time
          </span>
        </Link>

        {/* Mobile Navigation */}
        <nav className="flex items-center gap-1 md:hidden">
             {user ? <UserMenu user={user} /> : <LoginButton />}
        </nav>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5 text-xs font-medium h-8 px-3",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          {user ? <UserMenu user={user} /> : <LoginButton />}
        </div>
      </div>

       {/* Mobile Bottom Navigation (Optional - keeping existing pattern if desired, but maybe bottom nav is better for mobile) */}
       {/* Re-using the existing mobile bottom nav style */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border/50 bg-background/80 backdrop-blur-md md:hidden pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-3 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
