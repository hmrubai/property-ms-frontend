import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BatchStudentComponent } from './batch-student.component';
import { BatchStudentRoutes } from './batch-student.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BatchStudentRoutes),
      SharedModule

  ],
  declarations: [BatchStudentComponent]
})

export class BatchStudentModule {}
