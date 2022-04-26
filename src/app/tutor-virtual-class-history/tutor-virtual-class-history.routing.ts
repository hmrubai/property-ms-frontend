import { Routes } from '@angular/router';

import { TutorVirtualClassHistoryComponent } from './tutor-virtual-class-history.component';

export const TutorVirtualClassHistoryRoutes: Routes = [{
  path: '',
  component: TutorVirtualClassHistoryComponent,
  data: {
    breadcrumb: 'Tutor Virtual Class History',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
