import {NestFactory} from "@nestjs/core";
import {ConfigService} from "@nestjs/config";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {AppModule} from "./app.module";


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: [configService.get('KAFKA_BROKER')]
  //     },
  //     consumer: {
  //       groupId: configService.get('KAFKA_GROUP_ID'),
  //       allowAutoTopicCreation: true,
  //     },
  //   },
  // });

  // app.startAllMicroservices()
  await app.listen(3300)
}
bootstrap()