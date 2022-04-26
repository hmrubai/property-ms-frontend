import { Routes } from '@angular/router';

import { CorrectionSummaryComponent } from './correction-summary.component';

export const CorrectionSummaryRoutes: Routes = [{
  path: '',
  component: CorrectionSummaryComponent,
  data: {
    breadcrumb: 'Correction Summary',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
