import { Routes } from '@angular/router';

import { AssesmentListComponent } from './assesment-list.component';

export const AssesmentListRoutes: Routes = [{
  path: '',
  component: AssesmentListComponent,
  data: {
    breadcrumb: 'Assesment List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
