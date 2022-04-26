import { Routes } from '@angular/router';

import { ItemListComponent } from './item-list.component';

export const ItemListRoutes: Routes = [{
  path: '',
  component: ItemListComponent,
  data: {
    breadcrumb: 'Item List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
