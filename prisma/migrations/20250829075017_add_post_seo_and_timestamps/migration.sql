/*
  Warnings:

  - You are about to drop the column `canonicalUrl` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `nofollow` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `noindex` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `ogImage` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `canonicalUrl` on the `PostCategory` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `PostCategory` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `PostCategory` table. All the data in the column will be lost.
  - You are about to drop the column `nofollow` on the `PostCategory` table. All the data in the column will be lost.
  - You are about to drop the column `noindex` on the `PostCategory` table. All the data in the column will be lost.
  - You are about to drop the column `ogImage` on the `PostCategory` table. All the data in the column will be lost.
  - You are about to drop the column `canonicalUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `nofollow` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `noindex` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `ogImage` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "canonicalUrl",
DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "nofollow",
DROP COLUMN "noindex",
DROP COLUMN "ogImage";

-- AlterTable
ALTER TABLE "PostCategory" DROP COLUMN "canonicalUrl",
DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "nofollow",
DROP COLUMN "noindex",
DROP COLUMN "ogImage";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "canonicalUrl",
DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "nofollow",
DROP COLUMN "noindex",
DROP COLUMN "ogImage";

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Post_published_createdAt_idx" ON "Post"("published", "createdAt");

-- CreateIndex
CREATE INDEX "PostCategory_parentId_idx" ON "PostCategory"("parentId");

-- CreateIndex
CREATE INDEX "PostCategory_name_idx" ON "PostCategory"("name");
