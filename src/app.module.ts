import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BidsModule } from './bids/bids.module';
import { AuctionsModule } from './auctions/auctions.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuctionsGateway } from './auctions/auctions.gateway';
import { AuctionCronService } from './auctions/auction-cron.service';
import { AuctionsService } from './auctions/auctions.service';
import { BidsService } from './bids/bids.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AppRedisModule } from './redis/app.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimiterService } from './throttler/rate-limiter.service';

@Module({
  imports: [ConfigModule.forRoot(),ScheduleModule.forRoot(), ThrottlerModule.forRoot({
   throttlers: [
    {
      ttl: 60, 
      limit: 10, 
    }
   ]
  }), AppRedisModule, UsersModule, BidsModule, AuctionsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService,AuctionCronService, AuctionsService, AuctionsGateway , BidsService, RateLimiterService],
  exports: [PrismaService]
})
export class AppModule {}
