import { Routes } from '@angular/router';

import { TutorDetailsComponent } from './tutor-details.component';

export const TutorDetailsRoutes: Routes = [{
  path: '',
  component: TutorDetailsComponent,
  data: {
    breadcrumb: 'Tutor Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
