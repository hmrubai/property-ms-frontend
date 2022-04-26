import { Routes } from '@angular/router';

import { RentRollListComponent } from './rent-roll.component';

export const RentRollListRoutes: Routes = [{
  path: '',
  component: RentRollListComponent,
  data: {
    breadcrumb: 'Rent Roll',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
