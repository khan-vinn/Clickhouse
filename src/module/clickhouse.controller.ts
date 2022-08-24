import {Body, Controller, Get, Post, Req} from "@nestjs/common";
import {ClickhouseService} from "./clickhouse.service";
import {CreateTableDto} from "./dto/create-table.dto";
import {Request } from "express";
import {TestDto} from "./dto/test.dto";
import {RangeI} from "./interface/range.interface";
import {interval, Observable, tap} from "rxjs";

@Controller('api')
export class ClickhouseController {
    constructor(private readonly appService: ClickhouseService) {
    }
    public batch:TestDto[] = []
    public date;
    public schedule = interval(20*1000).pipe(tap(()=>{
        console.log('before')
        if (this.batch.length > 0) {
            console.log('after')
            this.appService.write(this.batch)
            this.batch = []
            return;
        }

    })).subscribe(console.log);

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
        if (this.batch.length > 50) {
            this.appService.write(this.batch)
            this.batch=[]
        }
    }

    @Get('create')
    createTable() {
        return  this.appService.create()
    }
}