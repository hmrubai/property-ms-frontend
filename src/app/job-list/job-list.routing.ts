import { Routes } from '@angular/router';

import { JobListComponent } from './job-list.component';

export const JobListRoutes: Routes = [{
  path: '',
  component: JobListComponent,
  data: {
    breadcrumb: 'Job List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
