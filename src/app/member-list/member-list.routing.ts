import { Routes } from '@angular/router';

import { MemberListComponent } from './member-list.component';

export const MemberListRoutes: Routes = [{
  path: '',
  component: MemberListComponent,
  data: {
    breadcrumb: 'Member List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
