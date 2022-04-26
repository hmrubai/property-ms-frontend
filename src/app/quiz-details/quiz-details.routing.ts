import { Routes } from '@angular/router';

import { QuizDetailsComponent } from './quiz-details.component';

export const QuizDetailsRoutes: Routes = [{
  path: '',
  component: QuizDetailsComponent,
  data: {
    breadcrumb: 'Quiz Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
