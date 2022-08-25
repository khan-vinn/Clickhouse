import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {ClickhouseDatabaseModule} from "./providers/clickhouse/clickhouse.module";
import {TaskModule} from "./module/bull/task.module";
import {TaskModule2} from "./module/task/task.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env'],
        }),
        ClickhouseDatabaseModule,
        TaskModule2,
    ],
    controllers: [],
    providers: []
})
export class AppModule {}