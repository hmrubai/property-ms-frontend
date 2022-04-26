import { Routes } from '@angular/router';

import { BillListComponent } from './bill-list.component';

export const BillListRoutes: Routes = [{
  path: '',
  component: BillListComponent,
  data: {
    breadcrumb: 'Bill List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
