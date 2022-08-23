import {Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {CLICKHOUSE_ASYNC_INSTANCE_TOKEN, ClickHouseClient} from "@depyronick/nestjs-clickhouse";


interface VisitsTable {
    traceID: string;
    microservice: string;
    service: string;
    method: string;
    type: string;
    data: string;
    message: string;
    eventDate: number;
}

@Injectable()
export  class ClickhouseService implements OnModuleInit{

  constructor(@Inject(CLICKHOUSE_ASYNC_INSTANCE_TOKEN) private analyticService: ClickHouseClient) {
  }

  async onModuleInit() {
       await this.createTable()
  }

  private createTable(){
      return this.analyticService.query('CREATE TABLE IF NOT EXISTS log (``)');
  }

  createLog(createTable) {
      this.analyticService.insert('log', createTable)
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

  private async find(options, total: Array<any>) {
      const data = await this.analyticService.queryPromise(options)
      return {
          data,
          total: total[total.length-1].totals,
      }
  }

  private count() :Promise<any> {
      return this.analyticService
          .queryPromise('SELECT COUNT(*) AS totals FROM log')
          .catch((err) => console.log(err))
  }

  async search(page: number, limit: number, search: string) {
      const offset = (page - 1) * limit;

      let options = `SELECT * FROM log ORDER BY(microservice, type) LIMIT ${limit} OFFSET ${offset} `
      if (search) {
          options = `SELECT * FROM log WHERE (traceID LIKE '%${search}%') ORDER BY(microservice, type) LIMIT ${limit} OFFSET ${offset}`
      }
      const totals = await this.count() as Array<any>
      return this.find(options, totals)
  }

    write(testDto) {
        this.analyticService.insert('test_date', testDto)
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
        this.analyticService.query('CREATE table test_date (`traceID` String, `data` String, `eventDate` DateTime) engine=MergeTree() partition by toYYYYMMDDhhmmss(eventDate) ORDER BY (eventDate) ')
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
    getAll() {
      return this.analyticService
          .queryPromise('SELECT * FROM test_date')
          .then(row => console.log(row))
          .catch(err => console.log(err))
    }
}