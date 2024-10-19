import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateBidDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;
    
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    auctionId: number;
}
