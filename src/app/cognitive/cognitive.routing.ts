import { Routes } from '@angular/router';

import { CognitiveComponent } from './cognitive.component';

export const CognitiveRoutes: Routes = [{
  path: '',
  component: CognitiveComponent,
  data: {
    breadcrumb: 'Cognitve Questions',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
