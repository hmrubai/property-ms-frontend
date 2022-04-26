import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CareerAppliedListComponent } from './career-applied-list.component';
import { CareerAppliedListRoutes } from './career-applied-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CareerAppliedListRoutes),
      SharedModule
  ],
  declarations: [CareerAppliedListComponent]
})

export class CareerAppliedListModule {}
