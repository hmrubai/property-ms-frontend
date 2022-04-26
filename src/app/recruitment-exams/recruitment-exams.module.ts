import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RecruitmentExamsComponent } from './recruitment-exams.component';
import { RecruitmentExamsRoutes } from './recruitment-exams.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RecruitmentExamsRoutes),
      SharedModule
  ],
  declarations: [RecruitmentExamsComponent]
})

export class RecruitmentExamsModule {}
