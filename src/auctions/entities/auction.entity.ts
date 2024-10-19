import { Bid } from "src/bids/entities/bid.entity";

export class Auction {
    id: number;
    uid: string;
    itemName: string;
    price: number;
    auctionStart: Date;
    auctionEnd: Date;
    open: boolean;
    bids?: Bid[]
    createdAt: Date;
    updatedAt: Date;
}
