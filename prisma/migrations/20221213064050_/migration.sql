-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;
