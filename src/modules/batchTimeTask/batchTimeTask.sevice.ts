import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {InjectRedis} from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import {LogsService} from "../logs/logs.service";

@Injectable()
export class BatchTimeTaskService {
    constructor(
        @InjectQueue('QUEUE_TASK') private taskQueue: Queue,
        @InjectRedis() private readonly redis: Redis,
        private logsService: LogsService,
    ) {}

    async onModuleInit() {
        console.log("test")
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
        // this.redis.flushall()
        console.log('check batch')
        const lastBatchCreationDate = Number(await this.redis.get('lastBatchCreationDate'))
        const currentDate = new Date().getTime()

        if (currentDate - lastBatchCreationDate > 1 * 10 * 1000) {
            console.log('time batch' )
            let batch
            const redisData = await this.redis.get('logs')
            if (redisData) {
                console.log('sent')
                batch = JSON.parse(redisData)
                await this.logsService.write(batch)
                await this.redis.del('logs')
            }
            await this.redis.set('lastBatchCreationDate', currentDate)
        }
    }
}