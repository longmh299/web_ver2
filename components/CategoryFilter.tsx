"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

type Cat = {
  id: number;
  name: string;
  parentId?: number | null;
};

export default function CategoryFilter({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  /* ================= ACTIVE ================= */
  const selectedId = (() => {
    const raw = (sp.get("categoryId") ?? "").trim();
    return /^\d+$/.test(raw) ? Number(raw) : undefined;
  })();

  /* ================= SPLIT ================= */
  const parents = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );

  const childrenMap = useMemo(() => {
    const map: Record<number, Cat[]> = {};
    categories.forEach((c) => {
      if (c.parentId) {
        if (!map[c.parentId]) map[c.parentId] = [];
        map[c.parentId].push(c);
      }
    });
    return map;
  }, [categories]);

  const activeParent = useMemo(() => {
    if (!selectedId) return undefined;
    const found = categories.find((c) => c.id === selectedId);
    if (!found) return undefined;
    return found.parentId || found.id;
  }, [selectedId, categories]);

  const [parentId, setParentId] = useState<number | undefined>(activeParent);

  /* ===== sync khi back ===== */
  useEffect(() => {
    setParentId(activeParent);
  }, [activeParent]);

  /* ================= NAV ================= */
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

    // 👉 scroll lên top cho UX tốt
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ================= UI ================= */
  return (
    <div className="sticky top-[64px] z-20 bg-[var(--color-bg)] py-3 border-b">

      <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-3">

        <div className="bg-white rounded-2xl border border-gray-200 p-3 md:p-4 shadow-sm">

          {/* ===== TITLE (desktop) ===== */}
          <div className="hidden md:block mb-3 text-sm font-semibold text-gray-500">
            Danh mục sản phẩm
          </div>

          {/* ===== PARENT ===== */}
          <div className="mb-3">

            <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible scrollbar-hide">

              {/* ALL */}
              <button
                onClick={() => {
                  setParentId(undefined);
                  go(undefined);
                }}
                className={`px-3 py-1.5 text-[13px] md:text-sm rounded-full border transition whitespace-nowrap
                  ${
                    !selectedId
                      ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                Tất cả
              </button>

              {parents.map((p) => {
                const active = parentId === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setParentId(p.id);

                      const firstChild = childrenMap[p.id]?.[0];

                      if (firstChild) {
                        go(firstChild.id);
                      } else {
                        go(p.id);
                      }
                    }}
                    className={`px-3 py-1.5 text-[13px] md:text-sm rounded-full border transition whitespace-nowrap
                      ${
                        active
                          ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ===== CHILD ===== */}
          {parentId && childrenMap[parentId] && (
            <div>

              <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible scrollbar-hide">

                {childrenMap[parentId].map((c) => {
                  const active = selectedId === c.id;

                  return (
                    <button
                      key={c.id}
                      onClick={() => go(c.id)}
                      className={`px-3 py-1 text-[12px] md:text-sm rounded-full border whitespace-nowrap transition
                        ${
                          active
                            ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                            : "bg-white hover:bg-gray-100"
                        }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}