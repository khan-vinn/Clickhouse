import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {ClickhouseDatabaseModule} from "./providers/clickhouse/clickhouse.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env'],
        }) ,
        ClickhouseDatabaseModule,
    ],
    controllers: [],
    providers: []
})
export class AppModule {}