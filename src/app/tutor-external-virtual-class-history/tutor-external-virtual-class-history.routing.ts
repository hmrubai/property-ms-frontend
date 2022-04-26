import { Routes } from '@angular/router';

import { TutorExternaVirtualClassHistoryComponent } from './tutor-external-virtual-class-history.component';

export const TutorExternaVirtualClassHistoryRoutes: Routes = [{
  path: '',
  component: TutorExternaVirtualClassHistoryComponent,
  data: {
    breadcrumb: 'Tutor Virtual Class History',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
