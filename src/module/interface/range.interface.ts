export interface RangeI {
    from : number;
    to : number;
}

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