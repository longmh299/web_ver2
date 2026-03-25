"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

type Cat = {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
};

export default function CategoryFilter({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const pathname = usePathname();

  /* 🔥 Lấy danh mục cuối (leaf) */
  const leafCategories = useMemo(() => {
    const hasChild = new Set<number>();

    categories.forEach((c) => {
      if (c.parentId) {
        hasChild.add(c.parentId);
      }
    });

    return categories.filter((c) => !hasChild.has(c.id));
  }, [categories]);

  /* 🔥 Navigate bằng slug */
  function go(cat?: Cat) {
    if (!cat) {
      router.push("/san-pham"); // tất cả sản phẩm
      return;
    }

    router.push(`/${cat.slug}`); // 👉 category page
  }

  return (
    <div className="sticky top-[64px] z-20 bg-[var(--color-bg)] py-3 border-b">

      <div className="max-w-7xl mx-auto px-3">

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">

          {/* ALL */}
          <button
            onClick={() => go(undefined)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border
              ${
                pathname === "/san-pham"
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "bg-gray-100"
              }`}
          >
            Tất cả
          </button>

          {leafCategories.map((cat) => {
            const active = pathname.includes(cat.slug);

            return (
              <button
                key={cat.id}
                onClick={() => go(cat)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition
                  ${
                    active
                      ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {cat.name}
              </button>
            );
          })}

        </div>

      </div>
    </div>
  );
}