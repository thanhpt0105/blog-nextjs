-- AlterTable: Make Post.authorId nullable and change onDelete behavior
-- This allows posts to remain when a user is deleted (author becomes null)
ALTER TABLE "posts" ALTER COLUMN "authorId" DROP NOT NULL;

-- Drop existing foreign key constraint
ALTER TABLE "posts" DROP CONSTRAINT "posts_authorId_fkey";

-- Add new foreign key with SetNull behavior
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" 
  FOREIGN KEY ("authorId") REFERENCES "users"("id") 
  ON DELETE SET NULL ON UPDATE CASCADE;
