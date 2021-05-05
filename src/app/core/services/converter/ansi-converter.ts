import { Injectable } from "@angular/core";
import { EbcdicDecoder } from "src/app/dashboard/utils/ebcdic-decoder";
import { EditorsData } from "./editors-data";
import { Strategy } from "./strategy";

@Injectable({
    providedIn: 'root'
})
export class AnsiConverter implements Strategy {

    convert(data: string, isFromEditor?: boolean): EditorsData {

        let ebcdicData = '';
        let hexEbcdic = '';
        if (isFromEditor) {
            ebcdicData = EbcdicDecoder.toASCII(data);
            hexEbcdic = data;
        } else {
            let hexArr = EbcdicDecoder.convertToHex(data, ' ').split(' ');
            hexEbcdic = hexArr.join(' ') + ' ';
        }

        return new EditorsData(hexEbcdic, ebcdicData);
    }
}