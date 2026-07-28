// app/admin/layout.tsx
import "@/app/globals.css";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex bg-slate-50 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}