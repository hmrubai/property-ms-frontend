import { Routes } from '@angular/router';

import { CorrectionListComponent } from './correction-list.component';

export const CorrectionListRoutes: Routes = [{
  path: '',
  component: CorrectionListComponent,
  data: {
    breadcrumb: 'Written Practice Correction',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
