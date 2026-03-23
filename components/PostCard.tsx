// components/PostCard.tsx
import Link from 'next/link';

export type PostCardData = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date;
  category?: { id: number; name: string } | null;
};

export default function PostCard({ p }: { p: PostCardData }) {
  return (
    <article className="group overflow-hidden rounded-xl border bg-white hover:shadow-md transition">
      <Link href={`/tin-tuc/${p.slug}`} className="block">
        {p.coverImage ? (
          <img
            src={p.coverImage}
            alt={p.title}
            className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : null}

        <div className="space-y-2 p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {p.category ? (
              <span className="rounded-full bg-gray-100 px-2 py-0.5">{p.category.name}</span>
            ) : null}
            <time dateTime={new Date(p.createdAt).toISOString()}>
              {new Date(p.createdAt).toLocaleDateString('vi-VN')}
            </time>
          </div>

          <h2 className="line-clamp-2 text-base font-semibold leading-snug group-hover:text-blue-600">
            {p.title}
          </h2>

          {p.excerpt ? (
            <p className="line-clamp-3 text-sm text-gray-600">{p.excerpt}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
