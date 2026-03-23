"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export type Item = {
  id: number;
  slug: string;
  name: string;
  short?: string | null;
  coverImage?: string | null;
};

function useSlidesPerView() {
  const [spv, setSpv] = useState(1);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1536) setSpv(5);
      else if (w >= 1280) setSpv(4);
      else if (w >= 1024) setSpv(3);
      else if (w >= 640) setSpv(2);
      else setSpv(1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return spv;
}

type Props = {
  title?: string;
  items: Item[];
  viewAllHref?: string;
  autoplayMs?: number;
  showDots?: boolean;
};

export default function FeaturedSlider({
  title = "Sản phẩm nổi bật",
  items,
  viewAllHref = "/san-pham",
  autoplayMs = 4500,
  showDots = true,
}: Props) {
  const spv = useSlidesPerView();
  const maxIndex = Math.max(0, items.length - spv);

  const [index, setIndex] = useState(0);
  const [isHover, setHover] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const startX = useRef(0);
  const deltaX = useRef(0);

  useEffect(() => {
    if (isHover || isTouching || maxIndex === 0) return;

    const t = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, autoplayMs);

    return () => clearInterval(t);
  }, [isHover, isTouching, autoplayMs, maxIndex]);

  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, items.length - spv)));
  }, [spv, items.length]);

  const slideWidthPct = useMemo(() => 100 / spv, [spv]);
  const translate = `translate3d(${-index * slideWidthPct}%,0,0)`;

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    setIsTouching(true);
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    deltaX.current = e.touches[0].clientX - startX.current;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    setIsTouching(false);
    const threshold = Math.min(120, window.innerWidth / 6);

    if (deltaX.current > threshold) {
      setIndex((i) => Math.max(0, i - 1));
    } else if (deltaX.current < -threshold) {
      setIndex((i) => Math.min(maxIndex, i + 1));
    }
  };

  return (
    <section
      className="max-w-7xl xl:max-w-[1280px] mx-auto px-4 lg:px-6 py-12 space-y-6"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <h2 className="text-[22px] md:text-[26px] font-semibold text-slate-800">
          {title}
        </h2>

        <Link
          href={viewAllHref}
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-gray-500 text-sm">Chưa có sản phẩm.</div>
      ) : (
        <div
          className="relative overflow-hidden"
          style={{ touchAction: "pan-y" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <ul
            className="flex transition-transform duration-500 ease-out"
            style={{
              width: `${(items.length * 100) / spv}%`,
              transform: translate,
            }}
          >
            {items.map((p) => (
              <li
                key={p.id}
                className="px-3"
                style={{
                  width: `${slideWidthPct}%`,
                  minWidth: `${slideWidthPct}%`,
                }}
              >
                {/* CARD */}
                <article className="h-full bg-white border border-gray-200 rounded-xl overflow-hidden transition duration-300 hover:shadow-lg hover:-translate-y-1 group">

                  {/* IMAGE */}
                  <Link href={`/san-pham/${p.slug}`} className="block">
                    <div className="relative bg-white h-[220px] md:h-[260px] flex items-center justify-center overflow-hidden">
                      {p.coverImage ? (
                        <Image
                          src={p.coverImage}
                          alt={p.name}
                          fill
                          className="object-contain p-4 transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">No Image</div>
                      )}
                    </div>
                  </Link>

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col gap-3">

                    <div className="text-[13px] text-gray-500">
                      Liên hệ
                    </div>

                    <Link
                      href={`/san-pham/${p.slug}`}
                      className="text-[15px] font-semibold text-slate-800 hover:text-[var(--color-accent)] line-clamp-2"
                    >
                      {p.name}
                    </Link>

                    {p.short && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {p.short}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => (window.location.href = "tel:0834551888")}
                        className="flex-1 text-center text-[13px] border border-gray-300 py-2 hover:bg-gray-100 transition"
                      >
                        Gọi ngay
                      </button>

                      <Link
                        href={`/san-pham/${p.slug}`}
                        className="flex-1 text-center text-[13px] bg-[var(--color-accent)] text-white py-2 hover:brightness-95 transition"
                      >
                        Xem chi tiết
                      </Link>
                    </div>

                  </div>
                </article>
              </li>
            ))}
          </ul>

          {/* NAV */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-white border border-gray-200 shadow"
              >
                ‹
              </button>

              <button
                onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
                className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-white border border-gray-200 shadow"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      {/* DOTS */}
      {showDots && maxIndex > 0 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-[var(--color-accent)]"
                  : "w-2.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}