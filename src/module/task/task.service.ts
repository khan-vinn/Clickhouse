import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TaskLogService } from './task-log.service';

@Injectable()
// Объявляем класс с названием TaskService
export class TaskService implements OnModuleInit {
  //OnModuleInit выполнится при старте приложения
  constructor(
    @InjectQueue('QUEUE_TASK') // Инжектим очередь QUEUE_TASK
    private taskQueue: Queue, // Через данную переменную можем обращаться к очереди BULL (QUEUE_TASK), ниже мы как раз добавляем задание в очередь через .add
    private readonly taskLogService: TaskLogService,
  ) {}

  private logger: Logger = new Logger(TaskService.name); // Обьявляем Logger для логирования всех действий

  onModuleInit() {
    /* ВНИМАНИЕ, ДАННЫЙ КОД ДЛЯ ПРИМЕРА, ОН БУДЕТ КАЖДЫЕ 5 СЕКУНД СТАВИТЬ ЗАДАЧИ В ОЧЕРЕДЬ BULL, ПОД НАЗВАНИЕМ QUEUE_TASK */
    let id = 1;
    setInterval(() => {
      this.queueTask(id); // Вызываем метод, который добавляет задачу в очередь BULL
      id++;
    }, 5000);
  }

  async queueTask(id: number) {
    // Метод ставит в очередь задачу для BULL
    await this.taskQueue.add(
      /* Данные для задачи */
      {
        taskData: {
          id, // ID задачи
          partnerId: 1, // Например для выполнения задачи нужно знать к какому партнеру относится задача
          text: 'В данном блоке мы добавляем любые данные для задачи',
        },
      },
      /* ----------------- */
      {
        jobId: `task_${id}`, // ID задачи, должно быть уникальным
        removeOnComplete: true, // Удалить после завершения true - да, false  - не
        attempts: 3, // Количество попыток в случае если произошла ошибка при запуске задачи
        delay: 3000, // Ставим задержку на выполнение, задача выполнится через 3 секунды после постановления
      },
    );
    this.logger.debug(`Добавлена задача в очередь BULL, id: ${id}`); // Выводим лог через метод debug (debug логирует только в тестовой среде, чтобы на продакшене не выводилось это в консоль)
  }

  async handleTask(id: number) {
    // Метод запускается из процессора BULL, то есть BULL когда получает задание, она запускается в процессоре. Так вот наш процессор вызывает данный метод
    this.logger.debug(`Задача выполнена, id: ${id}`);
    await this.taskLogService.writeLogTask(id, 'Задача выполнена');
  }
}
