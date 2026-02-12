/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tmdbId` to the `movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movie" ADD COLUMN     "tmdbId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "movie_tmdbId_key" ON "movie"("tmdbId");
