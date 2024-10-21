// redis.module.ts
import { Module, Global } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Global() // Makes the module globally available
@Module({
  imports: [
    RedisModule.forRoot({
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT, 10),
        },
        type: 'single'
    }),
  ],
  exports: [RedisModule], // Export RedisModule for other modules to use
})
export class AppRedisModule {}
