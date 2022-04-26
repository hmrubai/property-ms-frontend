import { Routes } from '@angular/router';

import { GuardianComplainTicketComponent } from './guardian-complain-ticket.component';

export const GuardianComplainTicketRoutes: Routes = [{
  path: '',
  component: GuardianComplainTicketComponent,
  data: {
    breadcrumb: 'Guardian Complain Tickets',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
