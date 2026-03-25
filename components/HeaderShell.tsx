// components/HeaderShell.tsx
import { prisma } from "@/lib/prisma";
import Header from "./Header";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Cat = {
  id: number;
  name: string;
  slug: string;
  children?: Cat[];
};

export default async function HeaderShell() {

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      children: {
        orderBy: [{ order: "asc" }, { name: "asc" }],
        include: {
          children: {
            orderBy: [{ order: "asc" }, { name: "asc" }],
          },
        },
      },
    },
  });

  // optional: filter slug null (an toàn SEO)
const clean = categories.map((c) => ({
  ...c,
  children: c.children?.map((sub) => ({
    ...sub,
    children: sub.children ?? [],
  })),
}));

  // console.log("HEADER TREE:", JSON.stringify(clean, null, 2));

  return <Header categories={clean} />;
}