import {Module} from "@nestjs/common";
import {BullModule} from "@nestjs/bull";
import {ConfigService} from "@nestjs/config";
import {LogsModule} from "../logs/logs.module";
import {BatchTimeProcess} from "./batchTime.process";
import {BatchTimeTaskService} from "./batchTimeTask.sevice";

@Module({
    imports: [
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                    password: configService.get('REDIS_PASSWORD'),
                }
            })
        }),
        BullModule.registerQueue({
            name: 'LOG_TASK',
        }),
        LogsModule,
    ],
    controllers: [],
    providers: [BatchTimeProcess, BatchTimeTaskService]
})
export class BatchTimeTaskModule {}