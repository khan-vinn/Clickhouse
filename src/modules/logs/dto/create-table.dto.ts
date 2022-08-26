import {IsNotEmpty, IsString} from "class-validator";

export class CreateTableDto {
    @IsString()
    @IsNotEmpty()
    traceID: string;

    @IsString()
    @IsNotEmpty()
    microservice: string;

    @IsString()
    @IsNotEmpty()
    service: string;

    @IsString()
    @IsNotEmpty()
    method: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    data: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}