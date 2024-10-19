import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";

export class Bid {
    id: number;
    uid: string;
    amount: number;
    userId: number;
    auctionId: number;
    user?: User
    auction?: Auction
    createdAt: Date;
    updatedAt: Date;
}
