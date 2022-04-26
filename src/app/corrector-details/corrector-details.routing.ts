import { Routes } from '@angular/router';

import { CorrectorDetailsComponent } from './corrector-details.component';

export const CorrectorDetailsRoutes: Routes = [{
  path: '',
  component: CorrectorDetailsComponent,
  data: {
    breadcrumb: 'Corrector Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
