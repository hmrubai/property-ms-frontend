import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecruitmentExamQuestionsComponent} from './recruitment-exam-questions.component';

const routes: Routes = [
  {
    path: '',
    component: RecruitmentExamQuestionsComponent,
    data: {
      breadcrumb: 'Recruitment Question Bank',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentExamQuestionsRoutingModule { }
