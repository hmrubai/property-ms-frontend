import { Routes } from '@angular/router';

import { AdmissionTestComponent } from './admission-test.component';

export const AdmissionTestRoutes: Routes = [{
  path: '',
  component: AdmissionTestComponent,
  data: {
    breadcrumb: 'Admission Test',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
