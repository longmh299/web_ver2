// app/admin/layout.tsx
import Link from "next/link";
import "@/app/globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const items = [
    { href: "/admin", label: "Bảng điều khiển" },
    { href: "/admin/products", label: "Sản phẩm" },
    { href: "/admin/categories", label: "Danh mục SP" },
    // 👇 NEW: Tin tức
    { href: "/admin/news", label: "Tin tức" },
    // Nếu sau này làm chuyên mục tin tức:
    // { href: "/admin/news-categories", label: "Chuyên mục tin tức" },
  ];

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl grid md:grid-cols-6 gap-4 p-4">
        <aside className="md:col-span-2 lg:col-span-2">
          <nav className="bg-white border rounded p-3 space-y-2">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="block px-3 py-2 rounded hover:bg-slate-100"
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="md:col-span-4 lg:col-span-4">{children}</main>
      </div>
    </div>
  );
}
