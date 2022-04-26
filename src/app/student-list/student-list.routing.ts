import { Routes } from '@angular/router';

import { StudentListComponent } from './student-list.component';

export const StudentListRoutes: Routes = [{
  path: '',
  component: StudentListComponent,
  data: {
    breadcrumb: 'Student List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
