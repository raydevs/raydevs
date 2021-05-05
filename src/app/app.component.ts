import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ToolbarService } from './shared/services/toolbar.service';

export interface MenuItem {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnDestroy {

  title: string = "Ebcdic Editor";
  selectedFont = 16;
  fonts = [10, 12, 14, 16, 18, 20];

  searchInput = '';

  fillerNav = Array.from({ length: 5 }, (_, i) => `Nav Item ${i + 1}`);

  constructor(private toolbarService: ToolbarService) { }

  ngOnDestroy(): void { }

  onFileChange(file: File) {
    this.toolbarService.newFileSelected(file);
  }

}
