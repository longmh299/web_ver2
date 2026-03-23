# MCBROTHER Fullstack (Next.js + Prisma + Tailwind)

## Cài đặt
1. Sửa `.env`:
```
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
ADMIN_USER="admin"
ADMIN_PASS="admin123"
```
2. Cài deps & Prisma:
```
npm i
npm run prisma:generate
npm run prisma:migrate -- --name init
npx ts-node prisma/seed.ts   # (tuỳ chọn)
```
3. Chạy dev:
```
npm run dev
```
- Trang chủ: `/`
- Danh sách: `/san-pham`
- Chi tiết: click 1 sản phẩm
- Admin: `/admin/login` → `/admin`

> FE đọc trực tiếp Prisma (SSR). Không dùng dữ liệu cứng.
