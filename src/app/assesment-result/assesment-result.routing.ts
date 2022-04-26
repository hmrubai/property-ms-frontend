import { Routes } from '@angular/router';

import { AssesmentResultComponent } from './assesment-result.component';

export const AssesmentResultRoutes: Routes = [{
  path: '',
  component: AssesmentResultComponent,
  data: {
    breadcrumb: 'Assesment Result',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
