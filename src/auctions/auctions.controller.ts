import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  async create(@Body() createAuctionDto: CreateAuctionDto) {
    try {
      return await this.auctionsService.create(createAuctionDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create auction.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.auctionsService.findAll();
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve auctions.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const auction = await this.auctionsService.findOne(+id);
      if (!auction) {
        throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
      }
      return auction;
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve auction.`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    try {
      const updatedAuction = await this.auctionsService.update(+id, updateAuctionDto);
      if (!updatedAuction) {
        throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
      }
      return updatedAuction;
    } catch (error) {
      throw new HttpException(
        `Failed to update auction.`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedAuction = await this.auctionsService.remove(+id);
      if (!deletedAuction) {
        throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
      }
      return deletedAuction;
    } catch (error) {
      throw new HttpException(
        `Failed to delete auction.`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
