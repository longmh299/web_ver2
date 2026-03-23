'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function asString(v: FormDataEntryValue | null) {
  return (v ?? '').toString().trim();
}
function asInt(
  v: FormDataEntryValue | null,
  opts?: { min?: number; max?: number; emptyIsNull?: boolean; zeroIsNull?: boolean }
): number | null {
  const { min, max, emptyIsNull = true, zeroIsNull = true } = opts || {};

  if (v === null) return null;
  const s = String(v).trim();
  if (s === '' && emptyIsNull) return null;

  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  if (zeroIsNull && n === 0) return null;
  if (min !== undefined && n < min) return null;
  if (max !== undefined && n > max) return null;
  return n;
}
function asBool(v: FormDataEntryValue | null) {
  return v === 'on' || v === 'true' || v === '1';
}

// NEW: tiện đổi '' -> null
const orNull = (s: string) => (s === '' ? null : s);

// NEW: chuẩn hoá YouTube -> /embed/ (link Cloudinary/khác giữ nguyên)
function toEmbedUrl(url: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.replace('/', '')}`;
    }
    return url;
  } catch {
    return url;
  }
}

export async function createProduct(formData: FormData) {
  const name = asString(formData.get('name'));
  const slug =
    asString(formData.get('slug')) ||
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  if (!name) throw new Error('Thiếu name');

  // NEW: lấy & chuẩn hoá videoUrl
  const videoUrlRaw = asString(formData.get('videoUrl'));
  const videoUrl = toEmbedUrl(orNull(videoUrlRaw));

  const data = {
    name,
    slug,
    short: asString(formData.get('short')),
    description: asString(formData.get('description')),
    sku: asString(formData.get('sku')) || null,
    price: asInt(formData.get('price')),
    coverImage: asString(formData.get('coverImage')) || null,

    // NEW: lưu video
    videoUrl,

    published: asBool(formData.get('published')),
    isFeatured: asBool(formData.get('isFeatured')),

    power: asString(formData.get('power')) || null,
    voltage: asString(formData.get('voltage')) || null,
    weight: asString(formData.get('weight')) || null,
    dimensions: asString(formData.get('dimensions')) || null,
    functions: asString(formData.get('functions')) || null,
    material: asString(formData.get('material')) || null,

    metaTitle: asString(formData.get('metaTitle')) || null,
    metaDescription: asString(formData.get('metaDescription')) || null,
    canonicalUrl: asString(formData.get('canonicalUrl')) || null,
    ogImage: asString(formData.get('ogImage')) || null,
    noindex: asBool(formData.get('noindex')),
    nofollow: asBool(formData.get('nofollow')),

    categoryId: asInt(formData.get('categoryId')),
  };

  await prisma.product.create({ data });
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function updateProduct(formData: FormData) {
  const id = asInt(formData.get('id'));
  if (!id) throw new Error('Thiếu id sản phẩm');

  const name = asString(formData.get('name'));
  const slug =
    asString(formData.get('slug')) ||
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  // NEW: lấy & chuẩn hoá videoUrl
  const videoUrlRaw = asString(formData.get('videoUrl'));
  const videoUrl = toEmbedUrl(orNull(videoUrlRaw));

  const data = {
    name,
    slug,
    short: asString(formData.get('short')),
    description: asString(formData.get('description')),
    sku: asString(formData.get('sku')) || null,
    price: asInt(formData.get('price')),
    coverImage: asString(formData.get('coverImage')) || null,

    // NEW: lưu video
    videoUrl,

    published: asBool(formData.get('published')),
    isFeatured: asBool(formData.get('isFeatured')),

    power: asString(formData.get('power')) || null,
    voltage: asString(formData.get('voltage')) || null,
    weight: asString(formData.get('weight')) || null,
    dimensions: asString(formData.get('dimensions')) || null,
    functions: asString(formData.get('functions')) || null,
    material: asString(formData.get('material')) || null,

    metaTitle: asString(formData.get('metaTitle')) || null,
    metaDescription: asString(formData.get('metaDescription')) || null,
    canonicalUrl: asString(formData.get('canonicalUrl')) || null,
    ogImage: asString(formData.get('ogImage')) || null,
    noindex: asBool(formData.get('noindex')),
    nofollow: asBool(formData.get('nofollow')),

    categoryId: asInt(formData.get('categoryId')),
  };

  await prisma.product.update({ where: { id }, data });
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProduct(formData: FormData) {
  const id = asInt(formData.get('id'));
  if (!id) throw new Error('Thiếu id');
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/products');
}

export async function bulkProductOp(formData: FormData) {
  const op = asString(formData.get('op'));
  const ids = formData.getAll('ids').map((v) => Number(v)).filter(Boolean);
  if (!ids.length) return;

  if (op === 'publish') await prisma.product.updateMany({ where: { id: { in: ids } }, data: { published: true } });
  else if (op === 'unpublish') await prisma.product.updateMany({ where: { id: { in: ids } }, data: { published: false } });
  else if (op === 'feature') await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isFeatured: true } });
  else if (op === 'unfeature') await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isFeatured: false } });
  else if (op === 'delete') await prisma.product.deleteMany({ where: { id: { in: ids } } });

  revalidatePath('/admin/products');
}
