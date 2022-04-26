import { Routes } from '@angular/router';

import { ConsumptionListComponent } from './consumption-list.component';

export const ConsumptionListRoutes: Routes = [{
  path: '',
  component: ConsumptionListComponent,
  data: {
    breadcrumb: 'Consumption List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
