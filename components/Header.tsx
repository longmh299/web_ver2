"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Cat = {
  id: number;
  name: string;
  slug: string;
  ogImage?: string | null;
  children?: Cat[];
};

export default function Header({ categories = [] }: { categories: Cat[] }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveTab(categories[0].id);
    }
  }, [categories]);

  const activeCategory = categories.find((c) => c.id === activeTab);

  const nav = [
    { href: "/", label: "Trang chủ" },
    { href: "/gioi-thieu", label: "Giới thiệu" },
    { href: "/san-pham", label: "Sản phẩm" },
    { href: "/tin-tuc", label: "Tin tức" },
    { href: "/lien-he", label: "Liên hệ" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="logo" width={50} height={50} />
          <div>
            <div className="font-semibold text-sm">MCBROTHER</div>
            <div className="text-xs text-gray-500">Machinery</div>
          </div>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((item) => {
            const active = isActive(item.href);

            if (item.href === "/san-pham") {
              return (
                <div key={item.href} className="relative group">
                  <Link
                    href="/san-pham"
                    className={`px-2 py-2 ${
                      active
                        ? "text-[var(--color-accent)]"
                        : "hover:text-[var(--color-accent)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                   {/* bridge */}
  <div className="absolute top-full left-0 w-full h-3"></div>
                  {/* MEGA MENU */}
                  <div className="fixed left-0 top-[52px] w-screen z-50
                    opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible
                    transition-all duration-200">

                    <div className="bg-white border-t shadow-lg w-full">
                      <div className="max-w-7xl mx-auto flex h-[520px]">

                        {/* LEFT MENU */}
                        <div className="w-[260px] border-r bg-gray-50 overflow-y-auto">

                          {categories.map((c) => (
                            <div
                              key={c.id}
                              onMouseEnter={() => setActiveTab(c.id)}
                              className={`px-4 py-3 text-sm cursor-pointer flex items-center gap-2
                                ${
                                  activeTab === c.id
                                    ? "bg-white font-medium text-[var(--color-accent)]"
                                    : "hover:bg-gray-100"
                                }`}
                            >
                              📦 {c.name}
                            </div>
                          ))}

                        </div>

                        {/* RIGHT CONTENT (SCROLL) */}
                        <div className="flex-1 overflow-y-auto p-6">

                          {activeCategory?.children?.map((sub) => (
                            <div key={sub.id} className="mb-8">

                              {/* TITLE */}
                              <Link
                                href={`/${sub.slug}`}
                                className="font-semibold text-base mb-4 block hover:text-[var(--color-accent)]"
                              >
                                {sub.name}
                              </Link>

                              {/* GRID ngang chuẩn */}
                              <div className="grid grid-cols-6 gap-6">

                                {sub.children?.map((child) => (
                                  <Link
                                    key={child.id}
                                    href={`/${child.slug}`}
                                    className="text-center group"
                                  >

                                    {/* IMAGE */}
                                    <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border bg-white
                                      shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-110">

                                      <Image
                                        src={child.ogImage || "/images/no-image.png"}
                                        alt={child.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>

                                    {/* NAME */}
                                    <div className="text-sm mt-3 text-gray-700 group-hover:text-[var(--color-accent)] line-clamp-2">
                                      {child.name}
                                    </div>

                                  </Link>
                                ))}

                              </div>

                            </div>
                          ))}

                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-2 ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "hover:text-[var(--color-accent)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}