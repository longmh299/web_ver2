// components/SeoPreview.tsx
'use client';

import { useMemo, useState } from 'react';

/* ===================== Types ===================== */

type Base = {
  /** Robots defaults */
  defaultNoindex?: boolean | null;
  defaultNofollow?: boolean | null;
};

/** Props kiểu cũ (không hậu tố 2) */
type PropsV1 = Base & {
  titleName?: string;
  descName?: string;
  urlName?: string;
  imageName?: string;

  defaultTitle?: string | null;
  defaultDesc?: string | null;
  defaultUrl?: string | null;
  defaultImage?: string | null;
};

/** Props kiểu mới (hậu tố 2) */
type PropsV2 = Base & {
  titleName2?: string;
  descName2?: string;
  urlName2?: string;
  imageName2?: string;

  defaultTitle2?: string | null;
  defaultDesc2?: string | null;
  defaultUrl2?: string | null;
  defaultImage2?: string | null;
};

type Props = PropsV1 | PropsV2;

/* ===================== Component ===================== */

export default function SeoPreview(props: Props) {
  // Resolve tên field (ưu tiên bản hậu tố 2 nếu có)
  const names = useMemo(() => {
    const titleName =
      'titleName2' in props
        ? props.titleName2 ?? 'metaTitle'
        : (props as PropsV1).titleName ?? 'metaTitle';

    const descName =
      'descName2' in props
        ? props.descName2 ?? 'metaDescription'
        : (props as PropsV1).descName ?? 'metaDescription';

    const urlName =
      'urlName2' in props
        ? props.urlName2 ?? 'canonicalUrl'
        : (props as PropsV1).urlName ?? 'canonicalUrl';

    const imageName =
      'imageName2' in props
        ? props.imageName2 ?? 'ogImage'
        : (props as PropsV1).imageName ?? 'ogImage';

    return { titleName, descName, urlName, imageName };
  }, [props]);

  // Resolve giá trị mặc định
  const defaults = useMemo(() => {
    const defaultTitle =
      'defaultTitle2' in props
        ? props.defaultTitle2 ?? ''
        : (props as PropsV1).defaultTitle ?? '';

    const defaultDesc =
      'defaultDesc2' in props
        ? props.defaultDesc2 ?? ''
        : (props as PropsV1).defaultDesc ?? '';

    const defaultUrl =
      'defaultUrl2' in props
        ? props.defaultUrl2 ?? ''
        : (props as PropsV1).defaultUrl ?? '';

    const defaultImage =
      'defaultImage2' in props
        ? props.defaultImage2 ?? ''
        : (props as PropsV1).defaultImage ?? '';

    const defaultNoindex = !!(props.defaultNoindex ?? false);
    const defaultNofollow = !!(props.defaultNofollow ?? false);

    return { defaultTitle, defaultDesc, defaultUrl, defaultImage, defaultNoindex, defaultNofollow };
  }, [props]);

  // State điều khiển input
  const [title, setTitle] = useState<string>(defaults.defaultTitle);
  const [desc, setDesc] = useState<string>(defaults.defaultDesc);
  const [url, setUrl] = useState<string>(defaults.defaultUrl);
  const [image, setImage] = useState<string>(defaults.defaultImage);
  const [noindex, setNoindex] = useState<boolean>(defaults.defaultNoindex);
  const [nofollow, setNofollow] = useState<boolean>(defaults.defaultNofollow);

  const titleCount = title.length;
  const descCount = desc.length;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="grid gap-2">
        <label className="text-sm">
          Meta title <span className="text-gray-500">({titleCount}/60)</span>
        </label>
        <input
          name={names.titleName}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="~50–60 ký tự"
        />
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <label className="text-sm">
          Meta description <span className="text-gray-500">({descCount}/160)</span>
        </label>
        <textarea
          name={names.descName}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full border rounded px-2 py-1"
          rows={3}
          placeholder="~140–160 ký tự"
        />
      </div>

      {/* Canonical URL */}
      <div className="grid gap-2">
        <label className="text-sm">Canonical URL</label>
        <input
          name={names.urlName}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="https://domain/duong-dan"
        />
      </div>

      {/* OG Image */}
      <div className="grid gap-2">
        <label className="text-sm">OG Image (URL)</label>
        <input
          name={names.imageName}
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="https://domain/path/og.jpg"
        />
        {image ? (
          <div className="rounded border p-2 bg-gray-50">
            <div className="text-xs text-gray-600 mb-1">Xem nhanh:</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="OG preview"
              className="max-h-40 object-contain"
            />
          </div>
        ) : null}
      </div>

      {/* Robots */}
      <div className="flex items-center gap-6">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="noindex"
            checked={noindex}
            onChange={(e) => setNoindex(e.target.checked)}
          />
          noindex
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="nofollow"
            checked={nofollow}
            onChange={(e) => setNofollow(e.target.checked)}
          />
          nofollow
        </label>
      </div>

      {/* Preview kiểu Google */}
      <div className="mt-2 rounded border p-3">
        <div className="text-[#1a0dab] text-xl leading-tight break-words">
          {title || 'Tiêu đề trang'}
        </div>
        <div className="text-[#006621] text-sm break-all">
          {url || 'https://domain/duong-dan'}
        </div>
        <div className="text-[#545454]">
          {desc || 'Mô tả ngắn gọn hiển thị trên kết quả tìm kiếm…'}
        </div>
        {(noindex || nofollow) && (
          <div className="mt-2 text-xs text-amber-600">
            Robots: {noindex ? 'noindex' : 'index'} • {nofollow ? 'nofollow' : 'follow'}
          </div>
        )}
      </div>
    </div>
  );
}
