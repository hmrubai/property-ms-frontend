import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CorrectionSummaryComponent } from './correction-summary.component';
import { CorrectionSummaryRoutes } from './correction-summary.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CorrectionSummaryRoutes),
      SharedModule
  ],
  declarations: [CorrectionSummaryComponent]
})

export class CorrectionSummaryModule {}
