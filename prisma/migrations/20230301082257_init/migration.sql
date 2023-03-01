-- CreateTable
CREATE TABLE "DuneQuery" (
    "id" TEXT NOT NULL,
    "execution_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DuneQuery_id_key" ON "DuneQuery"("id");
