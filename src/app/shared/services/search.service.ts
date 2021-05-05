import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchEvent: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  search(value: string) {
    this.searchEvent.next(value);
  }

  onSearch() {
    return this.searchEvent.asObservable();
  }

}
