// components/HeaderShell.tsx
import { prisma } from "@/lib/prisma";
import Header from "./Header";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ thêm id
type Cat = {
  id: number;
  name: string;
  slug: string;
};

export default async function HeaderShell() {
  const rows = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,       // 🔥 thêm dòng này
      name: true,
      slug: true,
    },
  });

  // TS-safe: bỏ các item không có slug
  const categories: Cat[] = rows
    .filter(
      (c): c is { id: number; name: string; slug: string } =>
        !!c.slug
    )
    .map((c) => ({
      id: c.id,       // 🔥 thêm id vào đây
      name: c.name,
      slug: c.slug!,
    }));

  return <Header categories={categories} />;
}