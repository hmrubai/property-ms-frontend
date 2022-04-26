import { Routes } from '@angular/router';

import { InstituteMemberListComponent } from './institute-member-list.component';

export const InstituteMemberListRoutes: Routes = [{
  path: '',
  component: InstituteMemberListComponent,
  data: {
    breadcrumb: 'Institute Member List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
