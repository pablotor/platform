-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('BACKEND', 'FRONTEND', 'ARCHITECTURE', 'INFRA', 'CODE', 'EDITORIAL');

-- AlterTable
ALTER TABLE "blog_post" ADD COLUMN     "category" "Category",
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kicker" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "blog_post_category_idx" ON "blog_post"("category");

-- CreateIndex
CREATE INDEX "blog_post_status_idx" ON "blog_post"("status");

-- CreateIndex
CREATE INDEX "blog_post_slug_idx" ON "blog_post"("slug");
