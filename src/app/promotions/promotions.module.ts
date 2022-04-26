import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PromotionComponent } from './promotions.component';
import { PromotionRoutes } from './promotions.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PromotionRoutes),
      SharedModule
  ],
  declarations: [PromotionComponent]
})

export class PromotionModule {}
