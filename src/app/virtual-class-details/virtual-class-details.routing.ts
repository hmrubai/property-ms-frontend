import { Routes } from '@angular/router';

import { VirtualClassDetailsComponent } from './virtual-class-details.component';

export const VirtualClassDetailsRoutes: Routes = [{
  path: '',
  component: VirtualClassDetailsComponent,
  data: {
    breadcrumb: 'Virtual Class Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
