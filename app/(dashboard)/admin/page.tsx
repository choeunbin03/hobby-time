import { AdminDashboard } from "@/components/posts/AdminDashboard";

export default function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          관리자 대시보드
        </h1>
        <p className="mt-2 text-muted-foreground">
          클래스, 세션, 예약을 관리하세요.
        </p>
      </div>
      <AdminDashboard />
    </main>
  );
}
