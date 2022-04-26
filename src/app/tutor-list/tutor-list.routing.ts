import { Routes } from '@angular/router';

import { TutorListComponent } from './tutor-list.component';

export const TutorListRoutes: Routes = [{
  path: '',
  component: TutorListComponent,
  data: {
    breadcrumb: 'Tutor List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
