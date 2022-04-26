import { Routes } from '@angular/router';

import { StudentExternalVirtualClassHistoryComponent } from './student-external-virtual-class-history.component';

export const StudentExternalVirtualClassHistoryRoutes: Routes = [{
  path: '',
  component: StudentExternalVirtualClassHistoryComponent,
  data: {
    breadcrumb: 'Student Virtual Class History',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
