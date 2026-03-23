"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Cat = { name: string; slug: string , id: number;};

export default function Header({ categories = [] }: { categories: Cat[] }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">

      {/* TOP BAR */}
      <div className="bg-[var(--color-primary)] text-white text-xs">
        <div className="max-w-6xl mx-auto px-4 h-8 flex items-center justify-between">
          <div className="opacity-90">
            Cung cấp thiết bị & công nghệ ngành thực phẩm, dược phẩm
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:0834551888">0834 551 888</a>
            <a
              href="https://zalo.me/0834551888"
              className="bg-[var(--color-accent)] px-2.5 py-1 rounded text-[11px]"
            >
              Zalo
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="MCBROTHER"
            width={56}
            height={56}
            className="rounded-full"
          />
          <div className="leading-tight">
            <div className="font-semibold text-[15px] tracking-tight">
              MCBROTHER
            </div>
            <div className="text-[12px] text-gray-500">
              Machinery & Packaging
            </div>
          </div>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((item) => {
            const active = isActive(item.href);

            if (item.href === "/san-pham") {
              return (
                <div key={item.href} className="relative group">

                  <Link
                    href="/san-pham"
                    className={`px-2 py-2 transition ${
                      active
                        ? "text-[var(--color-accent)]"
                        : "text-gray-700 hover:text-[var(--color-accent)]"
                    }`}
                  >
                    {item.label}
                  </Link>

                  {/* BRIDGE */}
                  <div className="absolute left-0 top-full h-3 w-full"></div>

                  {/* DROPDOWN */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full z-50
                    opacity-0 invisible translate-y-2
                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                    transition duration-200"
                  >
                    <div className="bg-white border shadow-lg rounded-xl p-3 w-[520px]">
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {categories.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/san-pham?categoryId=${c.id}`}
                            className="px-3 py-2 text-sm rounded hover:bg-gray-100"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>

                      <div className="mt-2 text-right">
                        <Link
                          href="/san-pham"
                          className="text-xs text-gray-500 hover:text-[var(--color-accent)]"
                        >
                          Xem tất cả →
                        </Link>
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
                className={`px-2 py-2 transition ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-gray-700 hover:text-[var(--color-accent)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <Link
            href="https://zalo.me/0834551888"
            className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
          >
            Zalo
          </Link>

          <Link
            href="/lien-he"
            className="hidden sm:inline-flex bg-[var(--color-accent)] text-white px-3 py-1.5 text-sm rounded font-medium"
          >
            Nhận báo giá
          </Link>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setOpenMenu(!openMenu)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 transition ${
          openMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpenMenu(false)}
      />

      {/* MOBILE MENU */}
      <div
        className={`md:hidden fixed right-0 top-0 h-full w-72 bg-white shadow-xl transform transition ${
          openMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 font-semibold border-b">Menu</div>

        <div className="p-3 space-y-2">
          {nav.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpenMenu(false)}
                className={`block px-3 py-2 rounded ${
                  active
                    ? "bg-gray-100 text-[var(--color-accent)]"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <a
            href="tel:0834551888"
            className="block mt-4 text-center bg-[var(--color-accent)] text-white py-2 rounded"
          >
            Gọi 0834 551 888
          </a>
        </div>
      </div>
    </header>
  );
}
