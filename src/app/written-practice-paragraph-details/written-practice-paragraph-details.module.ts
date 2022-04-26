import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { WrittenPracticeParagraghDetailsComponent } from './written-practice-paragraph-details.component';
import { WrittenPracticeParagraghDetailsRoutes } from './written-practice-paragraph-details.routing';
import {SharedModule} from '../shared/shared.module';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(WrittenPracticeParagraghDetailsRoutes),
      SharedModule,
      NgxEditorModule,
      
  ],
  declarations: [WrittenPracticeParagraghDetailsComponent]
})

export class WrittenPracticeParagraghDetailsModule {}
