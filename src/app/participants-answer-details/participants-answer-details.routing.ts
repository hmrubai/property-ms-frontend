import { Routes } from '@angular/router';

import { ParticipantAnswerDetailsComponent } from './participants-answer-details.component';

export const ParticipantAnswerDetailsRoutes: Routes = [{
  path: '',
  component: ParticipantAnswerDetailsComponent,
  data: {
    breadcrumb: 'Participant Answer Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
