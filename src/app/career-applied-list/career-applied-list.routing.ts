import { Routes } from '@angular/router';

import { CareerAppliedListComponent } from './career-applied-list.component';

export const CareerAppliedListRoutes: Routes = [{
  path: '',
  component: CareerAppliedListComponent,
  data: {
    breadcrumb: 'Career Applied List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
