import {IsArray, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {CreateTableDto} from "./create-table.dto";

export class ArrayValidation {
    @IsArray()
    @ValidateNested({each:true})
    @Type(() => CreateTableDto)
    logs: CreateTableDto[]
}