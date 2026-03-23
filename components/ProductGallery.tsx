"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  name,
  coverImage,
  images,
}: {
  name: string;
  coverImage?: string | null;
  images: { url: string; alt?: string | null }[];
}) {
  const list = [...(coverImage ? [{ url: coverImage, alt: name }] : []), ...images];
  const [idx, setIdx] = useState(0);

  if (list.length === 0)
    return (
      <div className="aspect-square rounded-xl border bg-white flex items-center justify-center text-slate-400">
        Chưa có ảnh
      </div>
    );

  return (
    <div className="space-y-3">
      {/* Ảnh lớn: 1:1, FULL cover */}
      <div className="relative aspect-square rounded-xl border bg-white overflow-hidden">
        <Image
          src={list[idx].url}
          alt={list[idx].alt || name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {list.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`relative aspect-square rounded border overflow-hidden ${
                i === idx ? "ring-2 ring-blue-500" : ""
              }`}
              type="button"
            >
              <Image
                src={img.url}
                alt={img.alt || name}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
