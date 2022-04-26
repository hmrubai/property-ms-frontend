import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentExamQuestionsRoutingModule } from './recruitment-exam-questions-routing.module';
import { RecruitmentExamQuestionsComponent } from './recruitment-exam-questions.component';
import { SharedModule } from '../shared/shared.module';
// import { NgbTooltipModule } from 'ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [RecruitmentExamQuestionsComponent],
  imports: [
    CommonModule,
    RecruitmentExamQuestionsRoutingModule,
    SharedModule,
    CollapseModule.forRoot(),
  ]
})
export class RecruitmentExamQuestionsModule { }
