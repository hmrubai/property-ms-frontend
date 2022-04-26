import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATCorrectionSummaryComponent } from './beat-correction-summary.component';
import { BEATCorrectionSummaryRoutes } from './beat-correction-summary.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATCorrectionSummaryRoutes),
      SharedModule
  ],
  declarations: [BEATCorrectionSummaryComponent]
})

export class BEATCorrectionSummaryModule {}
