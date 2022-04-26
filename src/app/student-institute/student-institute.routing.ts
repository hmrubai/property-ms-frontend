import { Routes } from '@angular/router';

import { studentInstituteComponent } from './student-institute.component';

export const ClassRoutes: Routes = [{
  path: '',
  component: studentInstituteComponent,
  data: {
    breadcrumb: 'Student Institute',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
