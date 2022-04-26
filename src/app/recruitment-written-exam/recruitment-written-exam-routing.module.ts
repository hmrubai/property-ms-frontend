import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecruitmentWrittenExamComponent} from './recruitment-written-exam.component';

const routes: Routes = [
  {
    path: '',
    component: RecruitmentWrittenExamComponent,
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
export class RecruitmentWrittenExamRoutingModule { }
