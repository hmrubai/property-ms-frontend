import { Routes } from '@angular/router';

import { BEATPackageListComponent } from './beat-package-list.component';

export const BEATPackageListRoutes: Routes = [{
  path: '',
  component: BEATPackageListComponent,
  data: {
    breadcrumb: 'Package List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
