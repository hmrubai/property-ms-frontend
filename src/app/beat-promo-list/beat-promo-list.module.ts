import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATPromoListComponent } from './beat-promo-list.component';
import { BEATPromoListRoutes } from './beat-promo-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATPromoListRoutes),
      SharedModule
  ],
  declarations: [BEATPromoListComponent]
})

export class BEATPromoListModule {}
