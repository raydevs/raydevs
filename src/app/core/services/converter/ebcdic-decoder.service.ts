import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EbcdicDecoderService {
  bytesPerRow: number = 30;

  constructor() { }

  converToHex(str: string, delim: string): string[] {
    let data = str.split('');
    let ret: string[] = [];
    let line : string = '';
    let idx = 0;
    for(let char of data) {
      const hex = ('0' + char.charCodeAt(0).toString(16)).slice(-2);
      line = line + hex + delim;
      if(idx > 0 && idx % this.bytesPerRow === 0) {
          ret.push(line);
          line = '';
      }
      idx++;
    }

    ret.push(line);
    return ret;
  }

}
