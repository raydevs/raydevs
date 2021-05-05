import { Injectable } from "@angular/core";
import { EbcdicDecoder } from "src/app/dashboard/utils/ebcdic-decoder";
import { EditorsData } from "./editors-data";
import { Strategy } from "./strategy";

@Injectable({
    providedIn: 'root'
})
export class EbcdicConverter implements Strategy {

    convert(data: string, isFromEditor?: boolean): EditorsData {

        let ebcdicData = '';
        let hexEbcdic = '';

        if (isFromEditor) {
            ebcdicData = EbcdicDecoder.toEBCDIC(data);
            hexEbcdic = data;
        } else {
            let hexArr = EbcdicDecoder.convertToHex(data, ' ').split(' ');
            let hexStr = hexArr.join(' ') + ' ';
            hexEbcdic = EbcdicDecoder.asciiHextoEbcdicHex(hexStr);
        }
        let response = new EditorsData(hexEbcdic, ebcdicData);
        return response;
    }
}