/* TASK MODULE, данный модуль будет выполнять фоновые задания с помощью BULL */

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { TaskService } from './task.service';
import { TaskProcess } from './task.process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLogService } from './task-log.service'; // Импортируем модуль bull для nestjs из офф. репозитория

@Module({
  imports: [
    // Подключаем модуль BULL
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          // BULL работает непосредственно с REDIS, указываем настройки подключения к REDIS (переменные берутся из .env файла):
          host: configService.get('REDIS_HOST'), // Хост
          port: configService.get('REDIS_PORT'), // Порт
          password: configService.get('REDIS_PASSWORD'), // Пароль
        },
      }),
      inject: [ConfigService], // Ставим зависимость от ConfigService, так как настройки нужно взять из файла .env
    }),
    // Регистрируем очередь QUEUE_TASK
    BullModule.registerQueue({
      name: 'QUEUE_TASK', // Название очереди
    }),
  ],
  controllers: [], // Здесь подключаем необходимые контроллеры, если такие необходимы
  providers: [TaskService, TaskProcess, TaskLogService], // Здесь подключаем провайдеры, в нашем случае сервисы и процессор для BULL(TaskProcess)
})
export class TaskModule2 {}
