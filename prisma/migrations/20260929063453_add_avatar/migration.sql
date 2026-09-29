/*
  Warnings:

  - You are about to drop the column `url` on the `image` table. All the data in the column will be lost.
  - Added the required column `data` to the `image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "image" DROP COLUMN "url",
ADD COLUMN     "data" BYTEA NOT NULL,
ADD COLUMN     "mime_type" TEXT NOT NULL;
