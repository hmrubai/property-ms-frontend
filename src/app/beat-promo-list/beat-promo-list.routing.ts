import { Routes } from '@angular/router';

import { BEATPromoListComponent } from './beat-promo-list.component';

export const BEATPromoListRoutes: Routes = [{
  path: '',
  component: BEATPromoListComponent,
  data: {
    breadcrumb: 'Promo Code List of SEW',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
