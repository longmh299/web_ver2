import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function NewsCategoriesPage() {
  const cats = await prisma.postCategory.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      parent: true,
      _count: { select: { posts: true, children: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chuyên mục tin tức</h1>
        <div className="flex gap-2">
          <Link href="/admin/news" className="text-blue-600 underline">
            ← Danh sách bài viết
          </Link>
          <Link
            href="/admin/news-categories/new"
            className="px-3 py-2 rounded bg-black text-white"
          >
            + Thêm chuyên mục
          </Link>
        </div>
      </div>

      <div className="bg-white border rounded overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-3 py-2 w-16">ID</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Cha</th>
              <th className="px-3 py-2 text-center">Bài</th>
              <th className="px-3 py-2 text-center">Thứ tự</th>
              <th className="px-3 py-2">SEO</th>
              <th className="px-3 py-2 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.id}</td>
                <td className="px-3 py-2 font-medium">{c.name}</td>
                <td className="px-3 py-2 text-slate-500">{c.slug}</td>
                <td className="px-3 py-2">{c.parent?.name ?? "-"}</td>
                <td className="px-3 py-2 text-center">{c._count.posts}</td>
                <td className="px-3 py-2 text-center">{c.order}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2 text-xs">
                    {c.noindex ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        noindex
                      </span>
                    ) : null}
                    {c.nofollow ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                        nofollow
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <Link
                    href={`/admin/news-categories/${c.id}`}
                    className="text-blue-600 underline"
                  >
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
            {cats.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-slate-500" colSpan={8}>
                  Chưa có chuyên mục nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
