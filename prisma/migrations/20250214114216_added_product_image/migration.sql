/*
  Warnings:

  - Made the column `searchvector` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "product_search_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image" TEXT,
ALTER COLUMN "searchvector" SET NOT NULL;
