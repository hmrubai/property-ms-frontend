import { Routes } from '@angular/router';

import { AssesmentParticipantsListComponent } from './assesment-participants.component';

export const AssesmentParticipantsListRoutes: Routes = [{
  path: '',
  component: AssesmentParticipantsListComponent,
  data: {
    breadcrumb: 'Assesment Participants',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
