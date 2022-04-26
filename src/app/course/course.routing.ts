import { Routes } from '@angular/router';

import { CourseComponent } from './course.component';

export const CourseRoutes: Routes = [{
  path: '',
  component: CourseComponent,
  data: {
    breadcrumb: 'Courses',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
