import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { FileSizePipe } from '../../pipes/file-size.pipe';

@Component({
  selector: 'app-file-chooser',
  templateUrl: './file-chooser.component.html',
  styleUrls: ['./file-chooser.component.scss']
})
export class FileChooserComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() fileChange = new EventEmitter();
  @Input() loading = false;

  file: File | null = null;
  fileSize = '';

  constructor(private fileSizePipe: FileSizePipe) { }

  ngOnInit(): void {
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const self = this;
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    this.fileSize = this.fileSizePipe.transform(this.file.size);
    this.fileChange.emit(this.file);
  }

  onClearFile() {
    this.file = null;
    this.fileSize = '';
    this.fileChange.emit(this.file);
  }
}
