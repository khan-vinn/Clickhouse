import {Injectable} from "@nestjs/common";
import {Process, Processor} from "@nestjs/bull";
import {BatchTimeTaskService} from "./batchTimeTask.sevice";
import {Job} from "bull";

@Injectable()
@Processor('QUEUE_TASK')
export class BatchTimeProcess {
    constructor(private readonly batchTimeService: BatchTimeTaskService) {}

    @Process()
    public async processTask(job: Job<{taskData}>) {
        try {
            this.batchTimeService.handleTask()
        }
        catch (err: any) {
            console.log(err)
        }
    }
}