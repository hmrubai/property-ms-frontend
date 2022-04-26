import { Routes } from '@angular/router';

import { ClassComponent } from './class.component';

export const ClassRoutes: Routes = [{
  path: '',
  component: ClassComponent,
  data: {
    breadcrumb: 'Classes',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
