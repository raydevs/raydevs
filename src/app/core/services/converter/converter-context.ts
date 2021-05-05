import { Injectable } from "@angular/core";
import { AnsiConverter } from "./ansi-converter";
import { ConverterEnum } from "./converter.enum";
import { EbcdicConverter } from "./ebcdic-converter";
import { EditorsData } from "./editors-data";
import { Strategy } from "./strategy";

@Injectable({
    providedIn: 'root'
})
export class ConverterContext {

    private _strategy!: Strategy;

    constructor(
        private ebcdicConverter: EbcdicConverter,
        private ansiConverter: AnsiConverter
    ) { }

    setStrategy(strategy_: string) {
        switch (strategy_) {
            case ConverterEnum.Ebcdic:
                this._strategy = this.ebcdicConverter;
                break;
            case ConverterEnum.Ansi:
                this._strategy = this.ansiConverter;
                break;
        }
    }

    public process(data: string, isFromEditor?: boolean): EditorsData {
        return this._strategy.convert(data, isFromEditor);
    }
}
