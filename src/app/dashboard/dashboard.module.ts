import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditorComponent } from './components/editor/editor.component';
import { SharedModule } from '../shared/shared.module';
//import { AceEditorModule } from 'ng2-ace-editor';
import { FormsModule } from '@angular/forms';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgMatSearchBarModule,
    FormsModule
  ],
  declarations: [DashboardComponent, EditorComponent]
})
export class DashboardModule { }
