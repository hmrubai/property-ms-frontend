import { Routes } from '@angular/router';

import { GuardianListComponent } from './guardian-list.component';

export const GuardianListRoutes: Routes = [{
  path: '',
  component: GuardianListComponent,
  data: {
    breadcrumb: 'Guardian List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
