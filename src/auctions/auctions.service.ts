import { Injectable } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Auction } from './entities/auction.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class AuctionsService {
  constructor(  private prismaService: PrismaService) {}
  // Method to find active auctions that should be closed
  async findActiveAuctionsToClose(currentDate: Date) {
    return this.prismaService.auction.findMany({
      where: {
        auctionEnd: {
          lte: currentDate,
        },
        open: true, // Assuming there's a 'status' field in your Auction model
      },
    });
  }

  // Method to close an auction
  async closeAuction(auctionId: number) {
    return this.prismaService.auction.update({
      where: { id: auctionId },
      data: { open: false }, // Update the auction status to CLOSED
    });
  }
 


  async create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const { itemName, auctionStart, auctionEnd } = createAuctionDto;
    return await this.prismaService.auction.create({ data: { itemName, auctionStart, auctionEnd, }, });
  }

  async findAll(): Promise<Auction[]> {
    return await this.prismaService.auction.findMany({
       include: {
        bids: true
       }
    });
  }

  // auctions.service.ts
async findScheduledAuctionsToOpen(currentDate: Date) {
  return this.prismaService.auction.findMany({
    where: {
      auctionStart: {
        lte: currentDate,
      },
      open: false, // Assuming 'SCHEDULED' means the auction is not yet open
    },
  });
}

// Method to Open an Auction
async openAuction(auctionId: number) {
  return this.prismaService.auction.update({
    where: { id: auctionId },
    data: { open: true}, // Update the auction status to OPEN
  });
}

  async findOne(id: number): Promise<Auction> {
    return await this.prismaService.auction.findUnique({where: { id }, });
  }

  async update(id: number, updateAuctionDto: UpdateAuctionDto): Promise<Auction> {
    return await this.prismaService.auction.update({ where: { id }, data: updateAuctionDto,});
  }

  async remove(id: number): Promise<Auction> {
    return await this.prismaService.auction.delete({ where: { id }, });
  }


}
