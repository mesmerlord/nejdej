/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `SubCategory` table. All the data in the column will be lost.
  - Added the required column `enTitle` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skTitle` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enTitle` to the `SubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skTitle` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "enDescription" TEXT,
ADD COLUMN     "enTitle" TEXT NOT NULL,
ADD COLUMN     "skDescription" TEXT,
ADD COLUMN     "skTitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "enDescription" TEXT,
ADD COLUMN     "enTitle" TEXT NOT NULL,
ADD COLUMN     "skDescription" TEXT,
ADD COLUMN     "skTitle" TEXT NOT NULL;
