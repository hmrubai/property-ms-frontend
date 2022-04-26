import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TutorVirtualClassHistoryComponent } from './tutor-virtual-class-history.component';
import { TutorVirtualClassHistoryRoutes } from './tutor-virtual-class-history.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(TutorVirtualClassHistoryRoutes),
      SharedModule
  ],
  declarations: [TutorVirtualClassHistoryComponent]
})

export class TutorVirtualClassHistoryModule {}
