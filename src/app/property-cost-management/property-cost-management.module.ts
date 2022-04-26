import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PropertyCostManagementComponent } from './property-cost-management.component';
import { PropertyCostManagementRoutes } from './property-cost-management.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PropertyCostManagementRoutes),
      SharedModule
  ],
  declarations: [PropertyCostManagementComponent]
})

export class PropertyCostManagementModule {}
