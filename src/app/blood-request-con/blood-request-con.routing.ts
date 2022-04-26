import { Routes } from '@angular/router';

import { BloodRequestConComponent } from './blood-request-con.component';

export const BloodRequestConRoutes: Routes = [{
  path: '',
  component: BloodRequestConComponent,
  data: {
    breadcrumb: 'Blood Request Configuration',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
