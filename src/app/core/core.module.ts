import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ConverterContext } from './services/converter/converter-context';
import { AnsiConverter } from './services/converter/ansi-converter';
import { EbcdicConverter } from './services/converter/ebcdic-converter';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [],
  // providers: [
  //   ConverterContext,
  //   AnsiConverter,
  //   EbcdicConverter
  // ]
})
export class CoreModule { }
