import { Routes } from '@angular/router';

import { AssesmentQuestionDetailsComponent } from './assesment-question-details.component';

export const AssesmentQuestionDetailsRoutes: Routes = [{
  path: '',
  component: AssesmentQuestionDetailsComponent,
  data: {
    breadcrumb: 'Assesment Question Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
