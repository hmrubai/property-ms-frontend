import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATCorrectorListComponent } from './beat-corrector-list.component';
import { BEATCorrectorListRoutes } from './beat-corrector-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATCorrectorListRoutes),
      SharedModule
  ],
  declarations: [BEATCorrectorListComponent]
})

export class BEATCorrectorListModule {}
