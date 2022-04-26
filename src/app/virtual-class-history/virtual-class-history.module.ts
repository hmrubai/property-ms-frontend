import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VirtualClassHistoryComponent } from './virtual-class-history.component';
import { VirtualClassHistoryRoutes } from './virtual-class-history.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VirtualClassHistoryRoutes),
      SharedModule
  ],
  declarations: [VirtualClassHistoryComponent]
})

export class VirtualClassHistoryModule {}
