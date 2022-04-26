import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CorrectionDetailsComponent } from './correction-details.component';
import { CorrectionDetailsRoutes } from './correction-details.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CorrectionDetailsRoutes),
      SharedModule
  ],
  declarations: [CorrectionDetailsComponent]
})

export class CorrectionDetailsModule {}
