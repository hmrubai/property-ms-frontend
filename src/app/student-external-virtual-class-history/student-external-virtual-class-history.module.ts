import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { StudentExternalVirtualClassHistoryComponent } from './student-external-virtual-class-history.component';
import { StudentExternalVirtualClassHistoryRoutes } from './student-external-virtual-class-history.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(StudentExternalVirtualClassHistoryRoutes),
      SharedModule
  ],
  declarations: [StudentExternalVirtualClassHistoryComponent]
})

export class StudentExternalVirtualClassHistoryModule {}
