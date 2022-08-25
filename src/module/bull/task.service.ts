import {Injectable, OnModuleInit} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {ClickhouseService} from "../clickhouse.service";

@Injectable()
export class TaskService implements OnModuleInit {
    constructor(
        @InjectQueue('QUEUE_TASK')
        private taskQueue: Queue,
        private readonly clickhouseService: ClickhouseService,
    ) {}

    onModuleInit() {
        let id = 1;
        setInterval(() => {
          this.queueTask(id); // Вызываем метод, который добавляет задачу в очередь BULL
          id++;
        }, 5000);
    }

    async queueTask(id) {
        await this.taskQueue.add(
            {
            taskData : {
                id,
                partnerId: 1,
                text: 'В данном блоке мы добавляем любые данные для задачи'
            }
        },
            {
                jobId: `task_${id}`,
                removeOnComplete: true,
                attempts: 3,
                delay: 3000,
            }
        )
    }

    async createTask(id) {
        await this.clickhouseService.write(id)
    }
}