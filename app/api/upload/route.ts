// app/api/upload/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

function folder() {
  return process.env.CLOUDINARY_FOLDER || 'mcbrother/products';
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // CASE A: re-host từ URL ngoài
    const url = form.get('url')?.toString().trim();
    if (url) {
      const uploaded = await cloudinary.uploader.upload(url, {
        folder: folder(),
      });
      return NextResponse.json({ ok: true, url: uploaded.secure_url, from: 'url' });
    }

    // CASE B: upload file từ máy
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ ok: false, error: 'Missing file or url' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ ok: false, error: 'Only image/* accepted' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: 'File too large (>10MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: folder(),
    });

    return NextResponse.json({ ok: true, url: uploaded.secure_url, from: 'file' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Upload failed' }, { status: 500 });
  }
}
