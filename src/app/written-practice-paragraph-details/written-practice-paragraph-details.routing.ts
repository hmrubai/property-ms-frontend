import { Routes } from '@angular/router';

import { WrittenPracticeParagraghDetailsComponent } from './written-practice-paragraph-details.component';

export const WrittenPracticeParagraghDetailsRoutes: Routes = [{
  path: '',
  component: WrittenPracticeParagraghDetailsComponent,
  data: {
    breadcrumb: 'Written Practice Paragragh Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
