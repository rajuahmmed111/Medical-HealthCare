/*
  Warnings:

  - The primary key for the `doctor_schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `doctor_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `doctor_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `doctor_schedule` table. All the data in the column will be lost.
  - The primary key for the `doctor_specialties` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `doctor_specialties` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `doctor_specialties` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `doctor_specialties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_schedule" DROP CONSTRAINT "doctor_schedule_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD CONSTRAINT "doctor_schedule_pkey" PRIMARY KEY ("scheduleId", "doctorId");

-- AlterTable
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("doctorId", "specialtiesId");
