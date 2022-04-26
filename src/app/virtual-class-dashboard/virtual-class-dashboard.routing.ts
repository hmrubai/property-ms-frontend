import { Routes } from '@angular/router';

import { VirtualClassDashboardComponent } from './virtual-class-dashboard.component';

export const VirtualClassDashboardRoutes: Routes = [{
  path: '',
  component: VirtualClassDashboardComponent,
  data: {
    breadcrumb: 'Virtual Class Dashboard',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
