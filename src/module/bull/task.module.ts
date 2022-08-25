import {Module} from "@nestjs/common";
import {BullModule} from "@nestjs/bull";
import {ConfigService} from "@nestjs/config";
import {TaskService} from "./task.service";
import {TaskProcess} from "./task.process";


@Module({
    imports: [
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                url: `redis://user:${configService.get('REDIS_PASSWORD')}@${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}/0`
            })
        }),
        BullModule.registerQueue({
            name: 'QUEUE_TASK'
        }),
    ],
    providers: [TaskService, TaskProcess],
    controllers: [],
})
export class TaskModule {}
