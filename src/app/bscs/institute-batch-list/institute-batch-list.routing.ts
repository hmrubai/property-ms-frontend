import { Routes } from '@angular/router';

import { InstituteBatchListComponent } from './institute-batch-list.component';

export const InstituteBatchListRoutes: Routes = [{
  path: '',
  component: InstituteBatchListComponent,
  data: {
    breadcrumb: 'Institute Batch List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
