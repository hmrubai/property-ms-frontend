import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATPaymentListComponent } from './beat-payment-list.component';
import { BEATPaymentListRoutes } from './beat-payment-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATPaymentListRoutes),
      SharedModule
  ],
  declarations: [BEATPaymentListComponent]
})

export class BEATPaymentListModule {}
