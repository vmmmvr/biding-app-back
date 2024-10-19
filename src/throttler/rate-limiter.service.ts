// rate-limiter.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RateLimiterService {
  constructor(@InjectRedis() private readonly redis: RedisClient) {}

  async isRateLimited(clientId: string): Promise<boolean> {
    // Define a key for storing request count
    const key = `rate-limit:${clientId}`;
    
    // Increment the request count and set expiration if not already set
    const currentCount = await this.redis.incr(key);
    
    if (currentCount === 1) {
      // Set an expiration for the key (e.g., 1 minute)
      await this.redis.expire(key, 60);
    }
    
    // Define the rate limit (e.g., 10 requests per minute)
    const RATE_LIMIT = 10;
    
    return currentCount > RATE_LIMIT;
  }
}
