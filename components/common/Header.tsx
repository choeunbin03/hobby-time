"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Home, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// PRD Phase 1 기준 메뉴 구성: 클래스 탐색, 내 예약
const navItems = [
  { href: "/", label: "클래스 탐색", icon: Home },
  { href: "/my-reservations", label: "내 예약", icon: Calendar },
];

export function Header() {
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

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
            <User className="h-4 w-4" />
          </Button>
          <Button size="sm" className="hidden md:flex h-8 text-xs font-medium px-4">
            <User className="mr-1.5 h-3.5 w-3.5" />
            로그인
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex border-t border-border/50 bg-card/50 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
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
