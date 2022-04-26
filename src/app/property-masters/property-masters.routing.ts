import { Routes } from '@angular/router';

import { PropertyMasterListComponent } from './property-masters.component';

export const PropertyMasterListRoutes: Routes = [{
  path: '',
  component: PropertyMasterListComponent,
  data: {
    breadcrumb: 'Property List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
