import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ItemListComponent } from './item-list.component';
import { ItemListRoutes } from './item-list.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ItemListRoutes),
      SharedModule

  ],
  declarations: [ItemListComponent]
})

export class ItemListModule {}
