import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorInt } from './utils/paginator-int';
import { GlobalErrorHandler } from '../global-error-handler';
import { FileChooserComponent } from './components/file-chooser/file-chooser.component';
import { ErrorComponent } from './components/error/error.component';
import { MaterialModule } from './material/material.module';
import { FileSizePipe } from './pipes/file-size.pipe';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    MaterialModule,
    ErrorComponent,
    FileChooserComponent,
    SearchComponent,

  ],
  declarations: [
    ErrorComponent,
    FileChooserComponent, FileSizePipe, SearchComponent
  ],
  providers: [
    FileSizePipe,
    { provide: MatPaginatorIntl, useClass: PaginatorInt },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class SharedModule { }
