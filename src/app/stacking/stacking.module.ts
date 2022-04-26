import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { StackingListComponent } from './stacking.component';
import { StackingListRoutes } from './stacking.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(StackingListRoutes),
      SharedModule
  ],
  declarations: [StackingListComponent]
})

export class StackingListModule {}
