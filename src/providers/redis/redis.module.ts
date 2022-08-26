import {Module} from "@nestjs/common";
import {RedisModule} from "@liaoliaots/nestjs-redis";
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [
        RedisModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                closeClient: true,
                config: {
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                    password: configService.get('REDIS_PASSWORD'),
                }
            })
        })
    ]
})
export class RedisConnectModule {}