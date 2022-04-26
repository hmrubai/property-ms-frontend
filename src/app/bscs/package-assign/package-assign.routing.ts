import { Routes } from '@angular/router';

import { PackageAssignComponent } from './package-assign.component';

export const PackageAssignRoutes: Routes = [{
  path: '',
  component: PackageAssignComponent,
  data: {
    breadcrumb: 'Package Assign',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
