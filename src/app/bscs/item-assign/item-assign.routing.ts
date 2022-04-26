import { Routes } from '@angular/router';

import { ItemAssignComponent } from './item-assign.component';

export const ItemAssignRoutes: Routes = [{
  path: '',
  component: ItemAssignComponent,
  data: {
    breadcrumb: 'Item Assign',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
