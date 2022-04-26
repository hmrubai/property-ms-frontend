import { Routes } from '@angular/router';

import { BEATCorrectorListComponent } from './beat-corrector-list.component';

export const BEATCorrectorListRoutes: Routes = [{
  path: '',
  component: BEATCorrectorListComponent,
  data: {
    breadcrumb: 'Corrector List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
