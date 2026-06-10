-- CreateTable
CREATE TABLE "ConfessionSchedule" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfessionSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfessionSchedule_day_key" ON "ConfessionSchedule"("day");
