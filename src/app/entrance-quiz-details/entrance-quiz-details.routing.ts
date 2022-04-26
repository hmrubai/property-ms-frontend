import { Routes } from '@angular/router';

import { EntranceQuizDetailsComponent } from './entrance-quiz-details.component';

export const EntranceQuizDetailsRoutes: Routes = [{
  path: '',
  component: EntranceQuizDetailsComponent,
  data: {
    breadcrumb: 'Quiz Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
