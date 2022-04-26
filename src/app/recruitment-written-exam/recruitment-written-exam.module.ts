import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentWrittenExamRoutingModule } from './recruitment-written-exam-routing.module';
import { RecruitmentWrittenExamComponent } from './recruitment-written-exam.component';
import { SharedModule } from '../shared/shared.module';
// import { NgbTooltipModule } from 'ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [RecruitmentWrittenExamComponent],
  imports: [
    CommonModule,
    RecruitmentWrittenExamRoutingModule,
    SharedModule,
    CollapseModule.forRoot(),
  ]
})
export class RecruitmentWrittenExamModule { }
