import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATCorrectionListComponent } from './beat-correction-list.component';
import { BEATCorrectionListRoutes } from './beat-correction-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATCorrectionListRoutes),
      SharedModule
  ],
  declarations: [BEATCorrectionListComponent]
})

export class BEATCorrectionListModule {}
