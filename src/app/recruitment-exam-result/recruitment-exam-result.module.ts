import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentExamResultRoutingModule } from './recruitment-exam-result-routing.module';
import { RecruitmentExamResultComponent } from './recruitment-exam-result.component';
import { SharedModule } from '../shared/shared.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [RecruitmentExamResultComponent],
  imports: [
    CommonModule,
    RecruitmentExamResultRoutingModule,
    SharedModule,
    CollapseModule.forRoot(),
  ]
})
export class RecruitmentExamResultModule { }
