/*
  Warnings:

  - You are about to drop the column `label` on the `debts` table. All the data in the column will be lost.
  - You are about to drop the column `limit` on the `debts` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `debts` table. All the data in the column will be lost.
  - You are about to drop the column `used` on the `debts` table. All the data in the column will be lost.
  - You are about to drop the column `itemType` on the `section_items` table. All the data in the column will be lost.
  - You are about to drop the `summaries` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `debts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtitle` to the `debts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `debts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `sections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "debts" DROP COLUMN "label",
DROP COLUMN "limit",
DROP COLUMN "status",
DROP COLUMN "used",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "color" TEXT NOT NULL DEFAULT 'blue',
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'credit_card',
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "section_items" DROP COLUMN "itemType",
ADD COLUMN     "variant" TEXT;

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "actionLabel" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "summaries";

-- CreateTable
CREATE TABLE "debt_details" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "debtId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "debt_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debt_details" ADD CONSTRAINT "debt_details_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "debts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
