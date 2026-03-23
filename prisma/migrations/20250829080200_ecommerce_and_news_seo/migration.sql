-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "nofollow" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noindex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ogImage" TEXT;

-- AlterTable
ALTER TABLE "PostCategory" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "nofollow" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noindex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ogImage" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "nofollow" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noindex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ogImage" TEXT;
