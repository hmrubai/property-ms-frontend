import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { StudentVirtualClassHistoryComponent } from './student-virtual-class-history.component';
import { StudentVirtualClassHistoryRoutes } from './student-virtual-class-history.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(StudentVirtualClassHistoryRoutes),
      SharedModule
  ],
  declarations: [StudentVirtualClassHistoryComponent]
})

export class StudentVirtualClassHistoryModule {}
