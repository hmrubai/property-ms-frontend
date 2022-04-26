import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ItemAssignComponent } from './item-assign.component';
import { ItemAssignRoutes } from './item-assign.routing';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ItemAssignRoutes),
      SharedModule

  ],
  declarations: [ItemAssignComponent]
})

export class ItemAssignModule {}
