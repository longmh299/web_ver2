// components/CategoryChips.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Cat = { id: number; name: string };

export default function CategoryChips({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const selectedId = (() => {
    const raw = (sp.get("categoryId") ?? "").trim();
    return /^\d+$/.test(raw) ? Number(raw) : undefined;
  })();

  function go(id?: number) {
    const params = new URLSearchParams(sp.toString());

    params.delete("cat");
    params.delete("page");

    if (!id) {
      params.delete("categoryId");
    } else {
      params.set("categoryId", String(id));
    }

    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;

    router.replace(url);
    router.refresh();
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">

      {/* ALL */}
      <button
        onClick={() => go(undefined)}
        className={`px-4 py-1.5 rounded-full text-sm border transition whitespace-nowrap
          ${
            !selectedId
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
              : "bg-white hover:bg-gray-100 text-gray-700"
          }`}
      >
        Tất cả
      </button>

      {categories.map((c) => {
        const active = selectedId === c.id;

        return (
          <button
            key={c.id}
            onClick={() => go(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm border transition whitespace-nowrap
              ${
                active
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}