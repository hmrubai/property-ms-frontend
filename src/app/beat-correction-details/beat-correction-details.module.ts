import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATCorrectionDetailsComponent } from './beat-correction-details.component';
import { BEATCorrectionDetailsRoutes } from './beat-correction-details.routing';
import {SharedModule} from '../shared/shared.module';
// import { NgxEditorModule } from 'ngx-editor';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATCorrectionDetailsRoutes),
      SharedModule,
      // NgxEditorModule,
      QuillModule.forRoot()
  ],
  declarations: [BEATCorrectionDetailsComponent]
})

export class BEATCorrectionDetailsModule {}
