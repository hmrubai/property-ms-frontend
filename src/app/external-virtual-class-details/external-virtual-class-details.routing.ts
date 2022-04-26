import { Routes } from '@angular/router';

import { ExternalVirtualClassDetailsComponent } from './external-virtual-class-details.component';

export const ExternalVirtualClassDetailsRoutes: Routes = [{
  path: '',
  component: ExternalVirtualClassDetailsComponent,
  data: {
    breadcrumb: 'Virtual Class Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
