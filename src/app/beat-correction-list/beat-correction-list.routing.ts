import { Routes } from '@angular/router';

import { BEATCorrectionListComponent } from './beat-correction-list.component';

export const BEATCorrectionListRoutes: Routes = [{
  path: '',
  component: BEATCorrectionListComponent,
  data: {
    breadcrumb: 'Smart English Writing (SEW)',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
