import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {LogsModule} from "./modules/logs/logs.module";
import {BatchTimeTaskModule} from "./modules/batchTimeTask/batchTimeTask.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env'],
        }),
        LogsModule,
        BatchTimeTaskModule,
    ],
    controllers: [],
    providers: []
})
export class AppModule {}