import { Routes } from '@angular/router';

import { CorrectionDetailsComponent } from './correction-details.component';

export const CorrectionDetailsRoutes: Routes = [{
  path: '',
  component: CorrectionDetailsComponent,
  data: {
    breadcrumb: 'Correction Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
