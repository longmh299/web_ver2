// app/admin/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [prod, cat, post, postCat] = await Promise.all([
    prisma.product.count().catch(() => 0),
    prisma.category.count().catch(() => 0),
    prisma.post.count().catch(() => 0),          // thống kê bài viết
    prisma.postCategory.count().catch(() => 0),  // 👈 thống kê chuyên mục tin tức
  ]);

  const Card = ({
    href,
    title,
    desc,
    count,
  }: {
    href: string;
    title: string;
    desc: string;
    count?: number | string;
  }) => (
    <Link
      href={href}
      className="block bg-white border rounded p-4 hover:shadow-sm transition"
    >
      <div className="text-sm opacity-60">{desc}</div>
      <div className="text-lg font-semibold mt-1">{title}</div>
      {count !== undefined && (
        <div className="mt-2 text-sm opacity-60">Tổng: {count}</div>
      )}
    </Link>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Bảng điều khiển</h1>

      {/* Thêm card "Chuyên mục tin tức" */}
      <div className="grid md:grid-cols-4 gap-3">
        <Card
          href="/admin/products"
          title="Sản phẩm"
          desc="Quản lý sản phẩm"
          count={prod}
        />
        <Card
          href="/admin/categories"
          title="Danh mục SP"
          desc="Quản lý danh mục sản phẩm"
          count={cat}
        />
        <Card
          href="/admin/news"
          title="Tin tức"
          desc="Danh sách & soạn bài viết"
          count={post}
        />
        <Card
          href="/admin/news-categories"
          title="Chuyên mục tin tức"
          desc="Quản lý chuyên mục bài viết"
          count={postCat}
        />
      </div>

      {/* Nút thao tác nhanh */}
      <div className="grid md:grid-cols-4 gap-3">
        <Link
          href="/admin/products/new"
          className="block bg-black text-white rounded px-4 py-3 text-center"
        >
          + Thêm sản phẩm
        </Link>
        <Link
          href="/admin/categories/new"
          className="block bg-black text-white rounded px-4 py-3 text-center"
        >
          + Thêm danh mục
        </Link>
        <Link
          href="/admin/news/new"
          className="block bg-black text-white rounded px-4 py-3 text-center"
        >
          + Viết bài mới
        </Link>
        <Link
          href="/admin/news-categories/new"
          className="block bg-black text-white rounded px-4 py-3 text-center"
        >
          + Thêm chuyên mục tin tức
        </Link>
      </div>
    </div>
  );
}
