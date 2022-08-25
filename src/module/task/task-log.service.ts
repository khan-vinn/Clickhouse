import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
// Объявляем класс с названием TaskLogService
export class TaskLogService {
  constructor(
  ) {}

  private logger: Logger = new Logger(TaskLogService.name); // Обьявляем Logger для логирования всех действий

  async writeLogTask(id: number, message: string) {
    // Метод записывает в базу данных лог выполнения задачи
    this.logger.debug(`Начинаю писать лог для задачи, id: ${id}`);
    return "test"
  }
}
