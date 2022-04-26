import { Routes } from '@angular/router';

import { InstituteListComponent } from './institute-list.component';

export const InstituteListRoutes: Routes = [{
  path: '',
  component: InstituteListComponent,
  data: {
    breadcrumb: 'Institute List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
