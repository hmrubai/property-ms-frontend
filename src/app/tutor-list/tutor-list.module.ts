import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TutorListComponent } from './tutor-list.component';
import { TutorListRoutes } from './tutor-list.routing';
import {SharedModule} from '../shared/shared.module';
import { NgxEditorModule } from 'ngx-editor';
@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(TutorListRoutes),
      SharedModule,
      NgxEditorModule
  ],
  declarations: [TutorListComponent]
})

export class TutorListModule {}
