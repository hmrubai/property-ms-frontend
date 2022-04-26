import { Routes } from '@angular/router';

import { StackingListComponent } from './stacking.component';

export const StackingListRoutes: Routes = [{
  path: '',
  component: StackingListComponent,
  data: {
    breadcrumb: 'Stacking',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
