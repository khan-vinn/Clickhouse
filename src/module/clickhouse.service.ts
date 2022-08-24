import {Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {CLICKHOUSE_ASYNC_INSTANCE_TOKEN, ClickHouseClient} from "@depyronick/nestjs-clickhouse";
import {RangeI} from "./interface/range.interface";

@Injectable()
export  class ClickhouseService implements OnModuleInit {

  constructor(@Inject(CLICKHOUSE_ASYNC_INSTANCE_TOKEN) private analyticService: ClickHouseClient) {}

  async onModuleInit() {
      const table: string[] = ['system_log', 'product_log']
      for (const string of table) {
         await this.createTable(string)
      }
  }

  private createTable(tableName: string){
      return this.analyticService.query(`
                CREATE TABLE IF NOT EXISTS  ${tableName} (
                    traceID String, 
                    microservice String, 
                    service String, 
                    method String, 
                    type String, 
                    data String, 
                    message String, 
                    eventDate DateTime DEFAULT NOW()
                ) engine=MergeTree() 
                partition by toYYYYMMDDhhmmss(eventDate) 
                ORDER BY (eventDate)`.trim())
          .subscribe({
          error: (err: any): void => {
              console.error('ERROR', err)
          },
          next: (row): void => {
              console.log(row);
          },
          complete: (): void => {
              console.log('поток завершен')
          },
      });
  }

  async get(page: number, limit: number, search: string, range: RangeI, offset: number) {

        let options = `
                    SELECT * FROM log 
                    WHERE eventDate BETWEEN ${range.from} AND ${range.to} 
                    ORDER BY(eventDate, microservice, type) 
                    LIMIT ${limit} OFFSET ${offset}`.trim()

        let total = `
                    SELECT COUNT(*) AS totals FROM log 
                    WHERE eventDate BETWEEN ${range.from} AND ${range.to}`.trim()

        if (search) {
            options = `
                    SELECT * FROM log 
                    WHERE (traceID LIKE '%${search}%' ) 
                    AND (eventDate BETWEEN ${range.from} AND ${range.to})
                    ORDER BY(microservice, type) 
                    LIMIT ${limit} OFFSET ${offset}`.trim()

            total = `
                    SELECT COUNT(*) AS totals FROM log 
                    WHERE (traceID LIKE '%${search}%') 
                    AND (eventDate BETWEEN ${range.from} AND ${range.to})`.trim()
        }

        let totals = await this.count(total) as Array<any>
        return await this.find(options, totals, page, limit)
  }

  private async count(total) :Promise<any> {
        return await this.analyticService
            .queryPromise(total)
            .catch((err) => console.log(err))
  }

  private async find(options, totals: Array<any>, page, limit) {
        const data = await this.analyticService
            .queryPromise(options)
            .catch((err) => console.log(err))

        return {
            data,
            page,
            limit,
            totals: totals[totals.length-1].totals,
        }
  }


  createLog(data) {
      this.analyticService.insert('log', data)
          .subscribe({
              error: (err: any): void => {
                  console.error('ERROR', err)
              },
              next: (row): void => {
                  console.log(row);
              },
              complete: (): void => {
                  console.log('поток завершен')
              },
          });
  }

  write(batch) {
        this.analyticService.insert('test',batch )
            .subscribe({
                error: (err: any): void => {
                    console.error('ERROR', err)
                },
                next: (row): void => {
                    console.log(row);
                },
                complete: (): void => {
                    console.log('поток завершен')
                },
            });
  }
  create() {
        this.analyticService.query('CREATE table test (`traceID` String, `data` String, `eventDate` DateTime DEFAULT NOW() )engine=MergeTree() partition by toYYYYMMDDhhmmss(eventDate) ORDER BY (eventDate) ')
            .subscribe({
                error: (err: any): void => {
                    console.error('ERROR', err)
                },
                next: (row): void => {
                    console.log(row);
                },
                complete: (): void => {
                    console.log('поток завершен')
                },
            });
  }
}