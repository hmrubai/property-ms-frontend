import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATItemListComponent } from './beat-item-list.component';
import { BEATItemListRoutes } from './beat-item-list.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATItemListRoutes),
      SharedModule

  ],
  declarations: [BEATItemListComponent]
})

export class BEATItemListModule {}
