import { Routes } from '@angular/router';

import { ParticipantDetailsComponent } from './assesment-participants-details.component';

export const ParticipantDetailsRoutes: Routes = [{
  path: '',
  component: ParticipantDetailsComponent,
  data: {
    breadcrumb: 'Participant Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
