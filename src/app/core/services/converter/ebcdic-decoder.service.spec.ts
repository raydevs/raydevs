import { TestBed } from '@angular/core/testing';

import { EbcdicDecoderService } from './ebcdic-decoder.service';

describe('EbcdicDecoderService', () => {
  let service: EbcdicDecoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbcdicDecoderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert to ebcdic in array of four lenght', ()=>{
    const data = 'âãÃÃÉÃâ@òðòð`ð÷`óñ`ððKòñKõõKùðö÷òôÈðòó@@@@ €|éÖôô@@@@õùù@ðöøðñ@ÖÒÃÖÕ@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  ';
    const converted = service.converToHex(data, ' ');
    console.log(converted);
    expect(converted.length).toEqual(4);
  });
});
