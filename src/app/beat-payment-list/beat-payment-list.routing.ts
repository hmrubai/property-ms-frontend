import { Routes } from '@angular/router';

import { BEATPaymentListComponent } from './beat-payment-list.component';

export const BEATPaymentListRoutes: Routes = [{
  path: '',
  component: BEATPaymentListComponent,
  data: {
    breadcrumb: 'Payment List of SEW',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
