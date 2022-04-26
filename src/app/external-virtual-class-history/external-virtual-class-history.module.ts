import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ExternalVirtualClassHistoryComponent } from './external-virtual-class-history.component';
import { ExternalVirtualClassHistoryRoutes } from './external-virtual-class-history.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ExternalVirtualClassHistoryRoutes),
      SharedModule
  ],
  declarations: [ExternalVirtualClassHistoryComponent]
})

export class ExternalVirtualClassHistoryModule {}
