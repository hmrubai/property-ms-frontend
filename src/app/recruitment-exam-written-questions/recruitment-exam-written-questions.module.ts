import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentExamWrittenQuestionsRoutingModule } from './recruitment-exam-written-questions-routing.module';
import { RecruitmentExamWrittenQuestionsComponent } from './recruitment-exam-written-questions.component';
import { SharedModule } from '../shared/shared.module';
// import { NgbTooltipModule } from 'ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [RecruitmentExamWrittenQuestionsComponent],
  imports: [
    CommonModule,
    RecruitmentExamWrittenQuestionsRoutingModule,
    SharedModule,
    CollapseModule.forRoot(),
  ]
})
export class RecruitmentExamWrittenQuestionsModule { }
