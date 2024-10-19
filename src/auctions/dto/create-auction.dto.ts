import { IsString, IsNotEmpty, IsDate } from "class-validator";

export class CreateAuctionDto {
    @IsString()
    @IsNotEmpty()
    itemName: string;

    @IsDate()
    @IsNotEmpty()
    auctionStart: Date;
    
    @IsDate()
    @IsNotEmpty()
    auctionEnd: Date;
}
