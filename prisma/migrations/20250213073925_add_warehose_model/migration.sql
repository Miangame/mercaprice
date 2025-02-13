-- CreateTable
CREATE TABLE "Warehouse" (
    "id" UUID NOT NULL,
    "externalId" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_externalId_key" ON "Warehouse"("externalId");
