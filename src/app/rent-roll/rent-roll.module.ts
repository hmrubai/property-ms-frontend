import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RentRollListComponent } from './rent-roll.component';
import { RentRollListRoutes } from './rent-roll.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RentRollListRoutes),
      SharedModule
  ],
  declarations: [RentRollListComponent]
})

export class RentRollListModule {}
