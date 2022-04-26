import { Routes } from '@angular/router';

import { BEATCollaboratorPaymentListComponent } from './beat-collaborator-list.component';

export const BEATCollaboratorPaymentListRoutes: Routes = [{
  path: '',
  component: BEATCollaboratorPaymentListComponent,
  data: {
    breadcrumb: 'Collaboration Payment List of SEW',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
