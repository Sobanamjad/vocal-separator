-- CreateTable
CREATE TABLE "Separation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "originalSize" INTEGER NOT NULL,
    "vocalsUrl" TEXT NOT NULL,
    "instrumentalUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Separation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Separation_userId_idx" ON "Separation"("userId");

-- CreateIndex
CREATE INDEX "Separation_createdAt_idx" ON "Separation"("createdAt");
