import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATPurchaseListComponent } from './beat-purchase-list.component';
import { BEATPurchaseListRoutes } from './beat-purchase-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATPurchaseListRoutes),
      SharedModule
  ],
  declarations: [BEATPurchaseListComponent]
})

export class BEATPurchaseListModule {}
