import { Routes } from '@angular/router';

import { BEATItemTypeComponent } from './beat-item-type.component';

export const BEATItemTypeRoutes: Routes = [{
  path: '',
  component: BEATItemTypeComponent,
  data: {
    breadcrumb: 'Type List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
