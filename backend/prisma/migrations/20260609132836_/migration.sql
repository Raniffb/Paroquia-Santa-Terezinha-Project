/*
  Warnings:

  - You are about to drop the column `time` on the `MassSchedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[day]` on the table `MassSchedule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `times` to the `MassSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'encontro',
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "MassSchedule" DROP COLUMN "time",
ADD COLUMN     "times" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "author" TEXT NOT NULL DEFAULT 'Administrador',
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'paroquia',
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'geral';

-- CreateTable
CREATE TABLE "Sacramento" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'pi-star',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sacramento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorariosInfo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HorariosInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MassSchedule_day_key" ON "MassSchedule"("day");
