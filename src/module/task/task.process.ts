import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TaskService } from './task.service';

@Injectable()
@Processor('QUEUE_TASK') // Указываем что процессор относится к очереди QUEUE_TASK
export class TaskProcess {
  constructor(private readonly taskService: TaskService) {}

  private logger: Logger = new Logger(TaskProcess.name); // Обьявляем Logger для логирования всех действий

  @Process()
  public async processTask(job: Job<{ taskData }>) {
    try {
      const { id } = job.data.taskData;
      this.taskService.handleTask(id);

      this.logger.debug(
        `Процессор получил задание на выполнения - запускаю задачу ${id}`,
      );
    } catch (err: any) {
      this.logger.error(`Произошла ошибка ${err.message}`); // Логируем, тип лога error - означает ошибка
    }
  }
}
