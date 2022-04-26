import { Routes } from '@angular/router';

import { BEATCorrectionDetailsComponent } from './beat-correction-details.component';

export const BEATCorrectionDetailsRoutes: Routes = [{
  path: '',
  component: BEATCorrectionDetailsComponent,
  data: {
    breadcrumb: 'Correction Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
