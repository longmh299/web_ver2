// components/CTA.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  zalo?: string;
  side?: "left" | "right";
  size?: number;      // đường kính nút tròn
  gap?: number;       // khoảng cách giữa các nút
  defaultOpen?: boolean;
  liftWhenFooter?: boolean;
};

export default function CTA({
  zalo = "0834551888",
  side = "right",
  size = 56,
  gap = 12,
  defaultOpen = true,
  liftWhenFooter = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [lift, setLift] = useState(0);

  const sideCls = side === "left" ? "left-4 md:left-6" : "right-4 md:right-6";
  const alignCls = side === "right" ? "items-end" : "items-start";

  // Né footer
  useEffect(() => {
    if (!liftWhenFooter) return;
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      (entries) => setLift(entries.some((e) => e.isIntersecting) ? size + gap + 20 : 0),
      { rootMargin: "0px 0px -120px 0px" }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, [liftWhenFooter, size, gap]);

  const circle =
    "rounded-full shadow-lg grid place-items-center select-none border bg-white " +
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500";

  return (
    <aside
      aria-label="CTA nhanh"
      className={`fixed z-50 ${sideCls} flex flex-col ${alignCls} transition-[bottom] duration-200`}
      style={{ bottom: `calc(${16 + lift}px + env(safe-area-inset-bottom))`, gap }}
    >
      {/* Nhóm nút mở rộng */}
      <div
        aria-hidden={!open}
        className={`flex flex-col transition ${open ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"}`}
        style={{ gap }}
      >
        {/* Zalo */}
        <a
          href={`https://zalo.me/${zalo}`}
          target="_blank"
          rel="noopener"
          aria-label="Nhắn Zalo"
          title="Nhắn Zalo"
          className={circle}
          style={{ width: size, height: size, borderColor: "#2653ED" }}
        >
          <img
            src="/images/zalo-logo.png"
            alt="Zalo"
            width={Math.round(size * 0.6)}
            height={Math.round(size * 0.6)}
            className="object-contain"
            loading="eager"
            decoding="async"
          />
        </a>
      </div>

      {/* Nút toggle đóng/mở */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${circle} text-gray-700 hover:bg-gray-50`}
        style={{ width: size, height: size, borderColor: "rgba(0,0,0,0.08)" }}
        title={open ? "Thu gọn" : "Mở nhanh"}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          <path d="M12 6l6 6H6l6-6z" fill="currentColor" />
        </svg>
      </button>
    </aside>
  );
}
