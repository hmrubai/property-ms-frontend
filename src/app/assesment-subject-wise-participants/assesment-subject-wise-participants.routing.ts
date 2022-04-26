import { Routes } from '@angular/router';

import { SubjectWiseParticipantsListComponent } from './assesment-subject-wise-participants.component';

export const SubjectWiseParticipantsListRoutes: Routes = [{
  path: '',
  component: SubjectWiseParticipantsListComponent,
  data: {
    breadcrumb: 'Assesment Subject Wise Participants',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
