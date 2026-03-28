/*
  Warnings:

  - Added the required column `amount` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "checkout_session" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "amount" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
