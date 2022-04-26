import { Routes } from '@angular/router';

import { ProjectStudentListComponent } from './project-student-list.component';

export const ProjectStudentListRoutes: Routes = [{
  path: '',
  component: ProjectStudentListComponent,
  data: {
    breadcrumb: 'Project Student List ',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
