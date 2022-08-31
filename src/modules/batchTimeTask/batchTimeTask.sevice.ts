import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {InjectRedis} from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import {LogsService} from "../logs/logs.service";

@Injectable()
export class BatchTimeTaskService {
    constructor(
        @InjectQueue('LOG_TASK') private taskQueue: Queue,
        @InjectRedis() private readonly redis: Redis,
        private logsService: LogsService,
    ) {}

    async onModuleInit() {
        console.log("bull")
        await this.queueTask();
        // await this.taskQueue.removeRepeatableByKey('__default__:batchTimeTask::10000')
        // console.log(await this.taskQueue.getRepeatableJobs())

        // const job = await this.taskQueue.getJob('batchTimeTask')
        // console.log(job)
        // this.taskQueue.
    }

    async queueTask() {
        await this.taskQueue.add({},
            {
                jobId: 1,
                removeOnComplete: true,
                repeat: {every: 5000},
            }
        )
    }

    async handleTask() {
        console.log('check batch')
        const lastBatchCreationDate = Number(await this.redis.get('lastBatchCreationDate'))
        const currentTime = new Date().getTime()
        const timeCatch = currentTime - lastBatchCreationDate > 2 * 10 * 1000

        if (timeCatch) {
            console.log('время для записать логов БД' )
            const redisData = await this.redis.get('logs')
            const batch = JSON.parse(redisData)

            if (batch) {
                console.log('количество логов записсанных БД', batch?.length)
                await this.logsService.write(batch)
                await this.redis.del('logs')
            }
            await this.redis.set('lastBatchCreationDate', currentTime)
        }
    }
}