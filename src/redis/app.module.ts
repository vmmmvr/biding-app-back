// redis.module.ts
import { Module, Global } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Global() // Makes the module globally available
@Module({
  imports: [
    RedisModule.forRoot({
        options: {
            host: 'localhost', // Redis host
            port: 6379, // Redis port
        },
        type: 'single'
    }),
  ],
  exports: [RedisModule], // Export RedisModule for other modules to use
})
export class AppRedisModule {}
