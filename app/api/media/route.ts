export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression('folder:mcbrother/*')
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    const images = result.resources.map((img: any) => ({
      url: img.secure_url,
      thumb: img.secure_url,
    }));

    return NextResponse.json({ ok: true, images });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}