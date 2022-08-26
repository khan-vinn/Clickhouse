import {Controller} from "@nestjs/common";
import {Request } from "express";
import {LogsService} from "./logs.service";
import {RangeI} from "./interface/range.interface";
import {ArrayValidation} from "./dto/array.validation";
import {MessagePattern, Payload} from "@nestjs/microservices";

@Controller('api')
export class LogsController {
    constructor(private readonly logsService: LogsService) {}


    @MessagePattern('post-system-log')
    postData(@Payload() req: ArrayValidation ){
        this.logsService.handleBatch(req.logs)
    }

    @MessagePattern('get-system-log')
    async getData(@Payload() req: Request) {
        const page: number = parseInt(req.query?.page as string) || 1;
        const limit: number = parseInt(req.query?.limit as string) || 10;
        const search: string = req.query?.search as string || ""
        const offset: number = (page - 1) * limit;
        const range: RangeI = { from: +req.query?.from || 0, to: +req.query?.to || Date.now() }

        return await this.logsService.get(page, limit, search, range, offset)
    }
}