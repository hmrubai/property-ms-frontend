import { Routes } from '@angular/router';

import { StudentVirtualClassHistoryComponent } from './student-virtual-class-history.component';

export const StudentVirtualClassHistoryRoutes: Routes = [{
  path: '',
  component: StudentVirtualClassHistoryComponent,
  data: {
    breadcrumb: 'Student Virtual Class History',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
