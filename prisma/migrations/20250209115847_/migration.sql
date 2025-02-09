/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
