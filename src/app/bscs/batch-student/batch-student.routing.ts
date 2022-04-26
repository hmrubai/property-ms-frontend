import { Routes } from '@angular/router';

import { BatchStudentComponent } from './batch-student.component';

export const BatchStudentRoutes: Routes = [{
  path: '',
  component: BatchStudentComponent,
  data: {
    breadcrumb: 'Batch Student List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
