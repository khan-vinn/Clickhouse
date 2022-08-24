import {Body, Controller, Get, Post, Req} from "@nestjs/common";
import {ClickhouseService} from "./clickhouse.service";
import {CreateTableDto} from "./dto/create-table.dto";
import {Request } from "express";
import {TestDto} from "./dto/test.dto";
import {RangeI} from "./interface/range.interface";

@Controller('api')
export class ClickhouseController {
    constructor(private readonly appService: ClickhouseService) {
    }
    public batch:TestDto[] = []
    public date;

    @Post('log')
    log(@Body() data: CreateTableDto){
        this.appService.createLog(data)
    }

    @Get('log')
    async write(@Req() req: Request) {
        const page: number = parseInt(req.query?.page as string) || 1;
        const limit: number = parseInt(req.query?.limit as string) || 10;
        const search: string = req.query?.s as string || ""
        const offset: number = (page - 1) * limit;
        const range: RangeI = { from: +req.query?.from || 0, to: +req.query?.to || Date.now() }

        return await this.appService.get(page, limit, search, range, offset)
    }


    @Post('post')
    writeTable(@Body() data) {
        // if (batch.length == 0) {
        //     this.date = new Date().getTime()
        // }
        this.batch = [...data, ...this.batch]
        console.log(this.batch)
        if (this.batch.length > 20) {
            this.appService.write(this.batch)
        }
    }

    @Get('create')
    createTable() {
        return  this.appService.create()
    }
}