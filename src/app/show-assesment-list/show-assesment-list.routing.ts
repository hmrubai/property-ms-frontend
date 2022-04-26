import { Routes } from '@angular/router';

import { ShowAssesmentListComponent } from './show-assesment-list.component';

export const ShowAssesmentListRoutes: Routes = [{
  path: '',
  component: ShowAssesmentListComponent,
  data: {
    breadcrumb: 'Assesment Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
