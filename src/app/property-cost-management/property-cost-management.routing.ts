import { Routes } from '@angular/router';

import { PropertyCostManagementComponent } from './property-cost-management.component';

export const PropertyCostManagementRoutes: Routes = [{
  path: '',
  component: PropertyCostManagementComponent,
  data: {
    breadcrumb: 'Property Cost Management',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
