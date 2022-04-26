import { Routes } from '@angular/router';

import { AppliedJobListComponent } from './applied-job-list.component';

export const AppliedJobListRoutes: Routes = [{
  path: '',
  component: AppliedJobListComponent,
  data: {
    breadcrumb: 'Applied Job List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];