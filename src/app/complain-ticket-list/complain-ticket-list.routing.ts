import { Routes } from '@angular/router';

import { ComplainTicketListComponent } from './complain-ticket-list.component';

export const ComplainTicketListRoutes: Routes = [{
  path: '',
  component: ComplainTicketListComponent,
  data: {
    breadcrumb: 'Complain Tickets',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
