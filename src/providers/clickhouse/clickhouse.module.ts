import {Module} from "@nestjs/common";
import {ClickHouseModule} from "@depyronick/nestjs-clickhouse";
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [
        ClickHouseModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                host: configService.get('CLICKHOUSE_HOST'),
                database: configService.get('CLICKHOUSE_DB'),
                username: configService.get('CLICKHOUSE_USER'),
                password: configService.get('CLICKHOUSE_PASSWORD'),
                synchronize: true,
            })
        }),
    ],
    providers: [],
    controllers: [],
})
export class ClickhouseDatabaseModule {}