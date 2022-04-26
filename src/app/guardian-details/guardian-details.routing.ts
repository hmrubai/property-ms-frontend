import { Routes } from '@angular/router';

import { GuardianDetailsComponent } from './guardian-details.component';

export const GuardianDetailsRoutes: Routes = [{
  path: '',
  component: GuardianDetailsComponent,
  data: {
    breadcrumb: 'Guardian Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
