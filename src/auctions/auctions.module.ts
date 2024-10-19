import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { AuctionsGateway } from './auctions.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { BidsService } from 'src/bids/bids.service';
import { AuctionCronService } from './auction-cron.service';
import { RateLimiterService } from 'src/throttler/rate-limiter.service';

@Module({
  controllers: [AuctionsController],
  providers: [AuctionsService, AuctionsGateway, PrismaService, BidsService,RateLimiterService],
})
export class AuctionsModule {}
