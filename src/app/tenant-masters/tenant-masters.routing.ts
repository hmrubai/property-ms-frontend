import { Routes } from '@angular/router';

import { TenantMasterListComponent } from './tenant-masters.component';

export const TenantMasterListRoutes: Routes = [{
  path: '',
  component: TenantMasterListComponent,
  data: {
    breadcrumb: 'Tenant List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
