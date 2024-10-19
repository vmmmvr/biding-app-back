import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuctionsService } from './auctions.service';
import { BidsService } from 'src/bids/bids.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UseGuards } from '@nestjs/common';
import { RateLimiterService } from 'src/throttler/rate-limiter.service';

@WebSocketGateway({
  namespace: '/auctions', 
  cors: {
    origin: '*', 
  },
})
export class AuctionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly auctionsService: AuctionsService,
    private readonly rateLimiterService: RateLimiterService,
    private readonly bidsService: BidsService
  ) {}

  handleConnection(client: Socket) {
    // console.log(`Client connected: ${client.id}`);
    client.emit('connection', { message: 'Welcome to the auction!' });
  }

  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
    // Handle any cleanup or notifications needed when a client disconnects
  }

  async rateLimitter(id: string, client: Socket) {
    const isRateLimited = await this.rateLimiterService.isRateLimited(client.id);
    if (isRateLimited) {
      // Disconnect or emit an error message to the client
      client.emit('rateLimitExceeded', { message: 'Too many requests. Please try again later.' });
      return;
    }
  }
  // Join an auction room
  @SubscribeMessage('joinAuction')
  async handleJoinAuction(client: Socket, auctionId: number) {
    client.join(`auction_${auctionId}`);
    // throttler
    await this.rateLimitter(client.id,client);

    const allbids =await this.bidsService.findAll({auctionId: auctionId});
    client.emit('joinedAuction', { message: `You have joined auction ${auctionId}`, bids: allbids });
    this.server.to(`auction_${auctionId}`).emit('userJoined', { message: `User ${client.id} joined the auction.` });
    console.log(`Client ${client.id} joined auction room: auction_${auctionId}`);
  }

  // Place a bid in the auction
  @SubscribeMessage('placeBid')
  async handlePlaceBid(client: Socket, data: { auctionId: number; amount: number , userId: number}) {
    const { auctionId, amount , userId} = data; 
    // Logic for handling a bid (e.g., updating the database, notifying other users)
   const newBid =  await this.bidsService.create(
     { amount ,
      auctionId,
      userId }
      
    ); // Assuming you have a placeBid method in AuctionsService

        // throttler
        await this.rateLimitter(client.id,client);
    this.server.to(`auction_${auctionId}`).emit('newBid', { message: `New bid of ${amount} by user ${client.id}`, newBid });
    console.log(`Client ${client.id} placed a bid of ${amount} in auction ${auctionId}`);
  }

  // Leave an auction room
  @SubscribeMessage('leaveAuction')
  handleLeaveAuction(client: Socket, auctionId: number) {
    client.leave(`auction_${auctionId}`);
    client.emit('leftAuction', { message: `You have left auction ${auctionId}` });
    this.server.to(`auction_${auctionId}`).emit('userLeft', { message: `User ${client.id} left the auction.` });
    console.log(`Client ${client.id} left auction room: auction_${auctionId}`);
  }

  // Close an auction
  @SubscribeMessage('closeAuction')
  async handleCloseAuction(client: Socket, auctionId: number) {
    await this.auctionsService.closeAuction(auctionId); // Assuming you have a closeAuction method in AuctionsService
    this.server.to(`auction_${auctionId}`).emit('auctionClosed', { message: `Auction ${auctionId} has been closed.` });
    this.server.socketsLeave(`auction_${auctionId}`);
    console.log(`Auction ${auctionId} closed and all users removed from the room.`);
  }


}
