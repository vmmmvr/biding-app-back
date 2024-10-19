-- AlterTable
ALTER TABLE `auctions` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `bids` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `updatedAt` DATETIME(3) NULL;
