import { Routes } from '@angular/router';

import { CorrectorListComponent } from './corrector-list.component';

export const CorrectorListRoutes: Routes = [{
  path: '',
  component: CorrectorListComponent,
  data: {
    breadcrumb: 'Corrector List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
