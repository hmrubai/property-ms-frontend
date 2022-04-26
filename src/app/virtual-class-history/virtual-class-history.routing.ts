import { Routes } from '@angular/router';

import { VirtualClassHistoryComponent } from './virtual-class-history.component';

export const VirtualClassHistoryRoutes: Routes = [{
  path: '',
  component: VirtualClassHistoryComponent,
  data: {
    breadcrumb: 'BacBon Virtual Class History',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
