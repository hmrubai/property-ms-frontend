import { Routes } from '@angular/router';

import { StudentComplainTicketComponent } from './student-complain-ticket.component';

export const StudentComplainTicketRoutes: Routes = [{
  path: '',
  component: StudentComplainTicketComponent,
  data: {
    breadcrumb: 'Student Complain Tickets',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
