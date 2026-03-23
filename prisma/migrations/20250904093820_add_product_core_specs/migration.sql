-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "functions" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "power" TEXT,
ADD COLUMN     "voltage" TEXT,
ADD COLUMN     "weight" TEXT;

-- CreateIndex
CREATE INDEX "ProductAttribute_productId_idx" ON "ProductAttribute"("productId");

-- CreateIndex
CREATE INDEX "ProductAttribute_sort_idx" ON "ProductAttribute"("sort");
