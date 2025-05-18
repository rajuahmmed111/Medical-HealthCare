/*
  Warnings:

  - Changed the type of `endDateTime` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startDateTime` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "endDateTime",
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "startDateTime",
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;
