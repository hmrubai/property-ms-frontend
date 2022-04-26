import { Routes } from '@angular/router';

import { StudentDetailsComponent } from './student-details.component';

export const StudentDetailsRoutes: Routes = [{
  path: '',
  component: StudentDetailsComponent,
  data: {
    breadcrumb: 'Student Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
