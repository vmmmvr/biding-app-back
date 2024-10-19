import { Bid } from "src/bids/entities/bid.entity";

export class User {
    id: number;   
    uid: string;  
    name: string; 
    email: string;
    bids?: Bid[]
    createdAt: Date;
    updatedAt: Date;
}
