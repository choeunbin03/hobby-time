import { AdminDashboard } from "@/components/posts/AdminDashboard";

export default function AdminClassesPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <AdminDashboard defaultTab="classes" />
    </main>
  );
}
