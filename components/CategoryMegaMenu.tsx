"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGrid, ChevronDown } from "lucide-react";

type Category = { id: number; name: string; slug: string };

export default function CategoryMegaMenu({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // đóng khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // đóng khi nhấn Esc
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="sticky top-20 z-30 bg-gray-50 border-b border-gray-200 shadow-md"
    >
      <div className="max-w-7xl xl:max-w-[1280px] mx-auto px-4 relative">
        <div className="py-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition"
          >
            <LayoutGrid className="w-4 h-4" />
            Danh mục sản phẩm
            <ChevronDown
              className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* MEGA MENU PANEL */}
        {open && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl p-4 z-40">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#cat-${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-[14px] font-medium uppercase text-gray-700 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}