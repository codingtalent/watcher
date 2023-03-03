-- CreateTable
CREATE TABLE "DuneQuery" (
    "id" BIGINT NOT NULL,
    "query_id" INTEGER NOT NULL,
    "execution_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DuneQuery_id_key" ON "DuneQuery"("id");

-- CreateIndex
CREATE INDEX "DuneQuery_execution_id_idx" ON "DuneQuery"("execution_id");

-- CreateIndex
CREATE INDEX "DuneQuery_createdAt_idx" ON "DuneQuery"("createdAt");
