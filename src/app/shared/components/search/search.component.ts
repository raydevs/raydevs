import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements AfterViewInit {

  //https://angular.io/api/core/ViewChild
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  searchInputSubscription: any;

  constructor(private searchService: SearchService) { }

  ngAfterViewInit(): void {
    this.searchInputSubscription = fromEvent(this.searchInputRef.nativeElement, 'keyup').pipe(

      // get event value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2)

      // Time in milliseconds between key events
      , debounceTime(1000)

      // If previous query is diffent from current   
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => this.searchService.search(text));
  }

  clearSerch() {
    this.searchInputRef.nativeElement.value = '';
  }

  ngOnDestroy() {
    this.searchInputSubscription.unsubscribe()
  }

}
