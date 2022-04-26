import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppliedJobListComponent } from './applied-job-list.component';
import { AppliedJobListRoutes } from './applied-job-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AppliedJobListRoutes),
      SharedModule
  ],
  declarations: [AppliedJobListComponent]
})

export class AppliedJobListModule {}
