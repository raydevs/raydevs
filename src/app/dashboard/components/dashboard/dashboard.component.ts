import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IdbFileService } from 'src/app/core/services/db/idb-file.service';
import { FileReaderService } from 'src/app/dashboard/services/file-reader.service';
import { EbcdicDecoder } from '../../utils/ebcdic-decoder';
import { Buffer } from 'buffer/';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';

import { NotificationService } from 'src/app/core/services/notification.service';
import { IBM01145Charset } from '../../utils/IBM01145-charset';


import * as ace from 'brace';
import 'brace/mode/text';
import 'brace/theme/monokai';
import {MatButtonToggleChange} from '@angular/material/button-toggle';
import { ConverterContext } from 'src/app/core/services/converter/converter-context';
import { ConverterEnum } from 'src/app/core/services/converter/converter.enum';
import { SearchService } from 'src/app/shared/services/search.service';
import { EbcdicDecoderService } from 'src/app/core/services/converter/ebcdic-decoder.service';
const Range = ace.acequire('ace/range').Range;

declare let jschardet: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  file: File | null = null;
  hexContent = '';
  ebcdicContent = '';

  // MatPaginator Inputs
  length = 1;
  pageSize = 1;
  pageSizeOptions = [1];

  currentPage = 0;
  chunkParts = 10;

  chunks: Blob[] = [];

  isSilentChange = false;
  isLoadingFile = false;

  ebcdicEditor: any;
  hexEditor: any;

  isPaste: boolean = false;
  defaultStrategy = ConverterEnum.Ebcdic;

  constructor(private fileReaderService: FileReaderService,
    private idbFileService: IdbFileService,
    private toolbarService: ToolbarService,
    private notificationService: NotificationService,
    private converterContext: ConverterContext,
    private searchService: SearchService,
    private ebcdicDecoderService: EbcdicDecoderService
  ) {
    this.converterContext.setStrategy(this.defaultStrategy);
  }

  ngAfterViewInit(): void {
    this.initEditor();
    this.initEvents();
  }

  ngOnInit() {
    let self = this;
    self.toolbarService.castFile.subscribe(file => {
      self.onFileChange(file);
    });

    this.searchService.onSearch().subscribe(searchInput => {
      console.log("To search: " + searchInput);
    })
  }

  private initEditor() {
    this.ebcdicEditor = ace.edit('ebcdicEditor');
    this.ebcdicEditor.getSession().setMode('ace/mode/text');
    this.ebcdicEditor.setTheme('ace/theme/monokai');
    this.ebcdicEditor.setOption('wrap', true);
    this.ebcdicEditor.focus();
    this.ebcdicEditor.$blockScrolling = Infinity;

    this.hexEditor = ace.edit('hexEditor');
    this.hexEditor.getSession().setMode('ace/mode/text');
    this.hexEditor.setTheme('ace/theme/monokai');
    this.hexEditor.setOption('wrap', true);
    this.hexEditor.setReadOnly(true);
    this.hexEditor.resize(true);
    this.hexEditor.$blockScrolling = Infinity;
  }

  initEvents() {
    this.ebcdicEditor.on('change', (event: any) => this.onChange(event));
    this.ebcdicEditor.on('paste', (event: any) => this.onPaste(event));
  }

  initPaginator() {
    this.length = 1;
    this.pageSize = 1;
    this.pageSizeOptions = [1];
  }

  onPaste(event: any) {
    let detectedCharset = jschardet.detect(event.text);
    if (EbcdicDecoder.SUPPORTED_CHARSETS.includes(detectedCharset.encoding)) {
      this.isPaste = true;
    } else {
      this.isPaste = false;
      this.notificationService.showError('Text with wrong codification');
    }
  }

  onChange(onChangeEvent: any) {
    /** if event is not an user event, do nothing and return */
    if (this.isSilentChange) return;

    this.setHexEditorCursorPosition();

    if (onChangeEvent.action === 'insert') {
      let result = this.converterContext.process(onChangeEvent.lines[0]);
      this.hexEditor.insert(result.hexData);
    }

    if (onChangeEvent.action === 'remove') {
      let range = new Range(onChangeEvent.start.row, onChangeEvent.start.column * 3,
        onChangeEvent.end.row, onChangeEvent.end.column * 3);
      this.hexEditor.getSession().remove(range);
    }

    setTimeout(this.markNotPintables, 100);
  }

  markNotPintables() {
    // TODO: analize why we lost edtior instance at this point: 
    // this.hexEditor only give us the div
    let hexE = ace.edit('hexEditor');

    hexE.getValue().trim().split(' ').forEach((hex:string, idex: number) => {
      if (EbcdicDecoder.NON_PRINTABLE_EBCDIC_HEX.includes(hex)) {
        let marker = hexE.session.addMarker(new Range(0, idex * 3, 0, idex * 3 + 3), 'ace_step', 'text', false);
      }
    });
  }

  private setHexEditorCursorPosition() {
    const ebcdicPosition = this.ebcdicEditor.getCursorPosition();
    let hexPositionCursor = ebcdicPosition.column * 3;
    this.hexEditor.moveCursorTo(ebcdicPosition.row, hexPositionCursor);
    this.hexEditor.scrollToLine(ebcdicPosition.row, true, true, function () { });
  }

  /**
   * Set or insert the value to the ebcdic editor preventing the onchange event
   * 
   * @param value 
   * @param isInsert if true inserts the value in the cursor position 
   *                 else set the value to the editor value
   */
  setEditorTextSilent(value: string, isInsert: boolean) {
    this.isSilentChange = true;
    if (isInsert)
      this.ebcdicEditor.insert(value);
    else this.ebcdicEditor.setValue(value);
    this.isSilentChange = false;
  }

  onFileChange(file: File) {
    this.file = file;
    if (!file) {
      this.clearEdition();
    } else {
      this.chunks = this.fileReaderService.sliceFile(this.file, this.chunkParts);
      this.length = this.chunks.length;
      this.isSilentChange = true;
      this.fileReaderService.readChunk(this.chunks[this.currentPage]).then(this.loaded);
    }
  }

  onPageFired(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.fileReaderService.readChunk(this.chunks[this.currentPage])
      .then(this.loaded);
  }

  loaded = (result: string) => {
    this.setHexEditorValue(EbcdicDecoder.convertToHex(result, ' '));
    this.ebcdicEditor.setValue(EbcdicDecoder.toEBCDIC(this.hexEditor.getValue()));
    if(this.isSilentChange)
      this.isSilentChange = false;
  };

  /**
   * Clears the saved edition, editor and paginator
   */
  clearEdition() {
    this.clearEditor();
    this.idbFileService.deleteDB();
    this.initPaginator();
  }

  /**
   * Clears the editor only
   */
  clearEditor() {
    if (this.hexEditor) this.setHexEditorValue('');
    if (this.ebcdicEditor) this.ebcdicEditor.setValue('');
  }

  onCodificationChange(mrChange: MatButtonToggleChange) {
    this.converterContext.setStrategy(mrChange.value);
    let editorsData = this.converterContext.process(this.hexEditor.getValue(), true);
    this.setEditorTextSilent(editorsData.ebcdicEditorData, false);
    this.setHexEditorValue(editorsData.hexData);
  }

  private setHexEditorValue(hexData: string) {
    this.hexEditor.setValue(hexData);
    this.hexEditor.clearSelection();
  }
}
