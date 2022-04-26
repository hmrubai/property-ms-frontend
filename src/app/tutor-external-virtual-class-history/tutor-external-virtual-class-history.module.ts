import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TutorExternaVirtualClassHistoryComponent } from './tutor-external-virtual-class-history.component';
import { TutorExternaVirtualClassHistoryRoutes } from './tutor-external-virtual-class-history.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(TutorExternaVirtualClassHistoryRoutes),
      SharedModule
  ],
  declarations: [TutorExternaVirtualClassHistoryComponent]
})

export class TutorExternaVirtualClassHistoryModule {}
