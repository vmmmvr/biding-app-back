// auction-cron.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuctionsService } from './auctions.service';
import { AuctionsGateway } from './auctions.gateway';

@Injectable()
export class AuctionCronService {
  constructor(
    private readonly auctionsService: AuctionsService,
    private readonly auctionsGateway: AuctionsGateway,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE) // Runs every minute
  async handleAuctionClosure() {
    const now = new Date();

    // Fetch all auctions that have ended but are still active
    const auctionsToClose = await this.auctionsService.findActiveAuctionsToClose(now);

    for (const auction of auctionsToClose) {
      // Mark the auction as closed
      await this.auctionsService.closeAuction(auction.id);

      // Notify all users that this auction has been closed
      this.auctionsGateway.server.to(`auction_${auction.id}`).emit('auctionClosed', {
        auctionId: auction.id,
        message: `Auction ${auction.itemName} has ended.`,
      });

      console.log(`Auction ${auction.id} closed.`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE) // Runs every minute
  async handleAuctionOpening() {
    const now = new Date();

    // Fetch all auctions that have reached their start time but are not open yet
    const auctionsToOpen = await this.auctionsService.findScheduledAuctionsToOpen(now);
        console.log("opened");
        
    for (const auction of auctionsToOpen) {
      // Mark the auction as open
      await this.auctionsService.openAuction(auction.id);

      // Notify all users that this auction has been opened
      this.auctionsGateway.server.to(`auction_${auction.id}`).emit('auctionOpened', {
        auctionId: auction.id,
        message: `Auction ${auction.itemName} has started.`,
      });

      console.log(`Auction ${auction.id} opened.`);
    }
  }
}
