import { EditorsData } from "./editors-data";

export interface Strategy {
    convert(data: string, isFromEditor?: boolean ): EditorsData;
}