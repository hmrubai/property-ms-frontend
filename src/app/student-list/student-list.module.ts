import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { StudentListComponent } from './student-list.component';
import { StudentListRoutes } from './student-list.routing';
import {SharedModule} from '../shared/shared.module';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(StudentListRoutes),
      SharedModule,
      NgxEditorModule
  ],
  declarations: [StudentListComponent]
})

export class StudentListModule {}
