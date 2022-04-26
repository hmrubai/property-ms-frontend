import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATItemTypeComponent } from './beat-item-type.component';
import { BEATItemTypeRoutes } from './beat-item-type.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATItemTypeRoutes),
      SharedModule

  ],
  declarations: [BEATItemTypeComponent]
})

export class BEATItemTypeModule {}
