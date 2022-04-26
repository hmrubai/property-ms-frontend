import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecruitmentQuotaListComponent} from './recruitment-quota-list.component';

const routes: Routes = [
  {
    path: '',
    component: RecruitmentQuotaListComponent,
    data: {
      breadcrumb: 'Recruitment Exam Quota',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentQuotaListRoutingModule { }
