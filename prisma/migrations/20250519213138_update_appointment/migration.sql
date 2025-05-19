-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
