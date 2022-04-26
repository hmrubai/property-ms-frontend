import { Routes } from '@angular/router';

import { VirtualClassDurationComponent } from './virtual-class-duration.component';

export const VirtualClassDurationRoutes: Routes = [{
  path: '',
  component: VirtualClassDurationComponent,
  data: {
    breadcrumb: 'Virtual Class Duration',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
