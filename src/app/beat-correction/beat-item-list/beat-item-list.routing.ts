import { Routes } from '@angular/router';

import { BEATItemListComponent } from './beat-item-list.component';

export const BEATItemListRoutes: Routes = [{
  path: '',
  component: BEATItemListComponent,
  data: {
    breadcrumb: 'Item List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
