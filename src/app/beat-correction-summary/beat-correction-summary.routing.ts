import { Routes } from '@angular/router';

import { BEATCorrectionSummaryComponent } from './beat-correction-summary.component';

export const BEATCorrectionSummaryRoutes: Routes = [{
  path: '',
  component: BEATCorrectionSummaryComponent,
  data: {
    breadcrumb: 'Correction Summary',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
