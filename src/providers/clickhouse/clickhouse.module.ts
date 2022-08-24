import {Module} from "@nestjs/common";
import {ClickHouseModule} from "@depyronick/nestjs-clickhouse";
import { ConfigService} from "@nestjs/config";
import {ClickhouseService} from "../../module/clickhouse.service";
import {ClickhouseController} from "../../module/clickhouse.controller";

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
    providers: [ClickhouseService],
    controllers: [ClickhouseController]
})
export class ClickhouseDatabaseModule {}