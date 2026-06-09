-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;
