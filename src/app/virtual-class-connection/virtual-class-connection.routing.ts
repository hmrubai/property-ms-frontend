import { Routes } from '@angular/router';

import { VirtualClassConnectionComponent } from './virtual-class-connection.component';

export const VirtualClassConnectionRoutes: Routes = [{
  path: '',
  component: VirtualClassConnectionComponent,
  data: {
    breadcrumb: 'E-Education connections',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
