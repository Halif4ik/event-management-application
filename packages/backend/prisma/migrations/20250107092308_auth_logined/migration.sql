/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropIndex
DROP INDEX "Auth_accessToken_key";

-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "accessToken",
ADD COLUMN     "logined" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleId",
ADD COLUMN     "userRole" "UserRole" NOT NULL DEFAULT 'GHOST';

-- DropTable
DROP TABLE "Role";
