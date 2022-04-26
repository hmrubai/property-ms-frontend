import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppliedJobDetailsComponent } from './applied-job-details.component';
import { AppliedJobDetailsRoutes } from './applied-job-details.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AppliedJobDetailsRoutes),
      SharedModule
  ],
  declarations: [AppliedJobDetailsComponent]
})

export class AppliedJobDetailsModule {}
