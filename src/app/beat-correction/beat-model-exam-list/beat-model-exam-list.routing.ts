import { Routes } from '@angular/router';

import { BEATModelExamListComponent } from './beat-model-exam-list.component';

export const BEATModelExamListRoutes: Routes = [{
  path: '',
  component: BEATModelExamListComponent,
  data: {
    breadcrumb: 'Model Exam List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
