import {Injectable} from "@nestjs/common";
import {Process, Processor} from "@nestjs/bull";
import {TaskService} from "./task.service";
import {Job} from "bull";

@Injectable()
@Processor('QUEUE_TASK')
export class TaskProcess {
    constructor(private readonly taskService: TaskService) {}

    @Process()
    public async processTask(job: Job<{ taskData }>) {
        try {
            const { id } = job.data.taskData
            this.taskService.createTask(id)
        } catch (err: any) {
            console.log(err)
        }
    }
}