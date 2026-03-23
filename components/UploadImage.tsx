'use client';

import { useRef, useState } from 'react';

type Props = {
  name: string;
  onUploaded?: (url: string) => void;
  accept?: string;       // mặc định image/*
  maxSizeMB?: number;    // mặc định 10MB
  folder?: string;       // folder Cloudinary (optional)
  className?: string;
  buttonLabel?: string;
};

export default function UploadImage({
  name,
  onUploaded,
  accept = 'image/*',
  maxSizeMB = 10,
  folder,
  className = '',
  buttonLabel = 'Tải ảnh từ máy',
}: Props) {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadToCloudinary(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !preset) {
      throw new Error('Thiếu env NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME hoặc NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
    }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', preset);

    // Nếu preset không cố định folder, bạn có thể truyền folder tại đây
    if (folder) fd.append('folder', folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: fd,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Cloudinary upload failed (${res.status})`);
    }

    const json = await res.json();
    if (!json?.secure_url) throw new Error('Cloudinary không trả secure_url');

    return json.secure_url as string;
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Chỉ hỗ trợ ảnh');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Ảnh quá lớn (> ${maxSizeMB}MB)`);
      return;
    }

    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      onUploaded?.(url);
    } catch (e: any) {
      alert(e?.message || 'Upload thất bại');
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="border rounded px-3 py-2 text-sm"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
        >
          {loading ? 'Đang tải…' : buttonLabel}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}
