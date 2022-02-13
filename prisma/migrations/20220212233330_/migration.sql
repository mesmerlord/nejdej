/*
  Warnings:

  - A unique constraint covering the columns `[enTitle,skTitle]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[enTitle,skTitle]` on the table `SubCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_enTitle_skTitle_key" ON "Category"("enTitle", "skTitle");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_enTitle_skTitle_key" ON "SubCategory"("enTitle", "skTitle");
