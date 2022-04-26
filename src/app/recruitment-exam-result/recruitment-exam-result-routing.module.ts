import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecruitmentExamResultComponent} from './recruitment-exam-result.component';

const routes: Routes = [
  {
    path: '',
    component: RecruitmentExamResultComponent,
    data: {
      breadcrumb: 'Recruitment Exam Result',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentExamResultRoutingModule { }
