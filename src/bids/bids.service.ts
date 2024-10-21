import { Injectable } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Bid } from './entities/bid.entity';
import { Auction } from 'src/auctions/entities/auction.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class BidsService {
  constructor(@InjectRedis() private readonly redis: Redis, private prismaService: PrismaService) {}

async create(createBidDto: CreateBidDto) {
  const { amount, userId, auctionId } = createBidDto;

  // Fetch the current highest bid from Redis
  const currentHighestBid = await this.getHighestBidFromCache(auctionId);

  // If there is a cached highest bid, verify if the new bid amount is higher
  if (currentHighestBid !== null && amount <= currentHighestBid) {
    throw new Error('Bid amount must be higher than the current highest bid');
  }

  // Continue with the transaction in Prisma
  return await this.prismaService.$transaction(async (prisma) => {
    // Lock the auction row for update
    const auction: Auction[] = await prisma.$queryRaw`SELECT * FROM \`auctions\` WHERE \`id\` = ${auctionId} FOR UPDATE`;

    if (!auction || auction.length === 0) {
      throw new Error('Auction not found');
    }

    const auctionData = auction[0];

    // Verify that the bid amount is higher than the current price 
    if (amount <= auctionData.price) {
      throw new Error('Bid amount must be higher than the current price');
    }

    // Create a new bid
    const newBid = await prisma.bid.create({
      data: {
        amount,
        userId,
        auctionId,
      },
    });

    // Update the auction's current price
    await prisma.auction.update({
      where: { id: auctionId },
      data: { price: amount },
    });

    // Cache the new highest bid in Redis
    await this.cacheHighestBid(auctionId, amount);

    return newBid;
  });
}


  // Cache the highest bid in Redis
  async cacheHighestBid(auctionId: number, highestBid: number) {
    await this.redis.set(`auction:${auctionId}:highestBid`, highestBid.toString());
  }

  // Retrieve the highest bid from Redis
  async getHighestBidFromCache(auctionId: number): Promise<number | null> {
    const cachedBid = await this.redis.get(`auction:${auctionId}:highestBid`);
    return cachedBid ? parseFloat(cachedBid) : null;
  }



  // Find all bids
  async findAll(fitlerCreteria?: {auctionId?: number,user?: boolean, auction?: boolean}): Promise<Bid[]> {
    const {auction, auctionId, user} = fitlerCreteria;
    return await this.prismaService.bid.findMany({
      where: {
        auctionId
      },
      include: {
        user,
        auction
      },
    });
  }

  // Find a single bid by ID
  async findOne(id: number): Promise<Bid> {
    return await this.prismaService.bid.findUnique({
      where: { id },
      include: {
        user: true,
        auction: true,
      },
    });
  }

  // Update a bid by ID
  async update(id: number, updateBidDto: UpdateBidDto): Promise<Bid> {
    return await this.prismaService.bid.update({
      where: { id },
      data: updateBidDto,
      include: {
        user: true,
        auction: true,
      },
    });
  }

  // Remove a bid by ID
  async remove(id: number): Promise<Bid> {
    return await this.prismaService.bid.delete({
      where: { id },
      include: {
        user: true,
        auction: true,
      },
    });
  }
}
