import { Routes } from '@angular/router';

import { SEWCollaboratorInfoComponent } from './beat-collaborator-info.component';

export const SEWCollaboratorInfoRoutes: Routes = [{
  path: '',
  component: SEWCollaboratorInfoComponent,
  data: {
    breadcrumb: 'Collaborator List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
