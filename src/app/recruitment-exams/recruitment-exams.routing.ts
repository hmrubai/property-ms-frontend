import { Routes } from '@angular/router';

import { RecruitmentExamsComponent } from './recruitment-exams.component';

export const RecruitmentExamsRoutes: Routes = [{
  path: '',
  component: RecruitmentExamsComponent,
  data: {
    breadcrumb: 'Recruitment Exams List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
