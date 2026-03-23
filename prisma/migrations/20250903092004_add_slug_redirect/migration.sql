/*
  Warnings:

  - The primary key for the `SlugRedirect` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `entityType` on the `SlugRedirect` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('post', 'product', 'category', 'postCategory');

-- AlterTable
ALTER TABLE "SlugRedirect" DROP CONSTRAINT "SlugRedirect_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "entityType",
ADD COLUMN     "entityType" "EntityType" NOT NULL,
ADD CONSTRAINT "SlugRedirect_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SlugRedirect_id_seq";

-- CreateIndex
CREATE INDEX "SlugRedirect_entityType_idx" ON "SlugRedirect"("entityType");
