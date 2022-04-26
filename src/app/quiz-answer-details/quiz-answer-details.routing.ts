import { Routes } from '@angular/router';

import { QuizAnswerDetailsComponent } from './quiz-answer-details.component';

export const QuizAnswerDetailsRoutes: Routes = [{
  path: '',
  component: QuizAnswerDetailsComponent,
  data: {
    breadcrumb: 'Quiz Answer Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
