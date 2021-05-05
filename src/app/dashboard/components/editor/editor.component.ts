import { EventEmitter, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
//import { Range } from "ace-builds"

declare let ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @ViewChild('editor') editor: any;

  @Input()
  content = '';
  //Editor settings to be able to set from parent
  @Input() title: string = '';
  @Input() theme: string = '';
  @Input() indentGuides: boolean = false;
  @Input() enableInvisibles: boolean = false;
  @Input() languageMode: string = '';
  @Input() readOnly: boolean = false;
  @Input() maxlines: number = 0;

  @Output() codeChange: EventEmitter<string> = new EventEmitter();

  minlines = 20;
  fontsize = 16;

  options: any = { maxLines: 1000, printMargin: false };

  constructor() { }

  ngOnInit() {
    let self = this;
    self.editor.getEditor().session.setOption('useWorker', true);
    if (self.languageMode === '')
      self.languageMode = 'text';
    self.options = {
      minLines: self.minlines,
      maxLines: self.maxlines,
      fontSize: self.fontsize,
      displayIndentGuides: self.indentGuides,
      showInvisibles: self.enableInvisibles,
      scrollPastEnd: true,
      showPrintMargin: false,
      wrapBehavioursEnabled: true,
      wrap: true
    };
  }

  onChange(evt: any) {
    if (this.editor.getEditor().isFocused()) {
      this.codeChange.emit(evt);
    }

    // const Range = ace.require('ace/range')['Range'];
    // this.editor.getEditor().session.addMarker(
    //   new Range(0, 0, 2, 100), 'myMarker', 'fullLine'
    // );

    // this.editor.getEditor().session.setAnnotations([{
    //   row: 1,
    //   column: 0,
    //   text: "Error Message", // Or the Json reply from the par
    //   type: "error" // also "warning" and "information" 
    // }]);
  }
}
