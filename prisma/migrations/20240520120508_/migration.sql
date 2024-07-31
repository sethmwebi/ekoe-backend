/*
  Warnings:

  - You are about to drop the column `session_state` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "session_state";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "type",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
