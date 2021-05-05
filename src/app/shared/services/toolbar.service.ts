import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  public file: BehaviorSubject<File> = new BehaviorSubject<File>(null!);
  castFile = this.file.asObservable();

  constructor() {}

  newFileSelected(newFile: File) {
    this.file.next(newFile);
  }
}
