import { Routes } from '@angular/router';

import { BEATPurchaseListComponent } from './beat-purchase-list.component';

export const BEATPurchaseListRoutes: Routes = [{
  path: '',
  component: BEATPurchaseListComponent,
  data: {
    breadcrumb: 'Purchase List of SEW',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
