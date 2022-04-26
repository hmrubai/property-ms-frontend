import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CorrectorDetailsComponent } from './corrector-details.component';
import { CorrectorDetailsRoutes } from './corrector-details.routing';
import {SharedModule} from '../shared/shared.module';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CorrectorDetailsRoutes),
      SharedModule,
      NgxEditorModule
  ],
  declarations: [CorrectorDetailsComponent]
})

export class CorrectorDetailsModule {}
