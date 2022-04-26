import { Routes } from '@angular/router';

import { AppliedJobDetailsComponent } from './applied-job-details.component';

export const AppliedJobDetailsRoutes: Routes = [{
  path: '',
  component: AppliedJobDetailsComponent,
  data: {
    breadcrumb: 'Applied job details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
