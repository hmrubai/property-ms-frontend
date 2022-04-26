import { Routes } from '@angular/router';

import { EntranceQuizComponent } from './entrance-quiz.component';

export const EntranceQuizRoutes: Routes = [{
  path: '',
  component: EntranceQuizComponent,
  data: {
    breadcrumb: 'Quiz List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
