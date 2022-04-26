import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecruitmentExamWrittenQuestionsComponent} from './recruitment-exam-written-questions.component';

const routes: Routes = [
  {
    path: '',
    component: RecruitmentExamWrittenQuestionsComponent,
    data: {
      breadcrumb: 'Recruitment Written Exam List',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentExamWrittenQuestionsRoutingModule { }
