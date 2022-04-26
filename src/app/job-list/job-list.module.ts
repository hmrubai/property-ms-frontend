import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { JobListComponent } from './job-list.component';
import { JobListRoutes } from './job-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(JobListRoutes),
      SharedModule
  ],
  declarations: [JobListComponent]
})

export class JobListModule {}
