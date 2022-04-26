import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ConsumptionListComponent } from './consumption-list.component';
import { ConsumptionListRoutes } from './consumption-list.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ConsumptionListRoutes),
      SharedModule

  ],
  declarations: [ConsumptionListComponent]
})

export class ConsumptionListModule {}
