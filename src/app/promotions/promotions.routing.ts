import { Routes } from '@angular/router';

import { PromotionComponent } from './promotions.component';

export const PromotionRoutes: Routes = [{
  path: '',
  component: PromotionComponent,
  data: {
    breadcrumb: 'Promotion List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
