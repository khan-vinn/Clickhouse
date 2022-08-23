import {Body, Controller, Get, Post, Req} from "@nestjs/common";
import {ClickhouseService} from "./clickhouse.service";
import {CreateTableDto} from "./dto/create-table.dto";
import {Request } from "express";
import {TestDto} from "./dto/test.dto";

@Controller('api')
export class ClickhouseController {
    constructor(private readonly appService: ClickhouseService) {
    }

    @Post('log')
    log(@Body() createTable: CreateTableDto){
        this.appService.createLog(createTable)
    }

    @Get('log')
    async test(@Req() req: Request) {
        const page = parseInt(req.query?.page as string) || 1;
        const limit = parseInt(req.query?.limit as string) || 10;
        const search = req.query.s as string || ""

        return await this.appService.search(page, limit, search)
    }


    @Post('post')
    writeTable(@Body() testDto: TestDto) {
        this.appService.write(testDto)
    }
    @Get('create')
    createTable() {
        return  this.appService.create()
    }
    @Get('test-date')
    getAll() {
        return this.appService.getAll()
    }
}