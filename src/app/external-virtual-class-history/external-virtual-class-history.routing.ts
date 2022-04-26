import { Routes } from '@angular/router';

import { ExternalVirtualClassHistoryComponent } from './external-virtual-class-history.component';

export const ExternalVirtualClassHistoryRoutes: Routes = [{
  path: '',
  component: ExternalVirtualClassHistoryComponent,
  data: {
    breadcrumb: 'Virtual Class History',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
