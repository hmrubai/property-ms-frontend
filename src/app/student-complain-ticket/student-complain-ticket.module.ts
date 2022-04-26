import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { StudentComplainTicketComponent } from './student-complain-ticket.component';
import { StudentComplainTicketRoutes } from './student-complain-ticket.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(StudentComplainTicketRoutes),
      SharedModule
  ],
  declarations: [StudentComplainTicketComponent]
})

export class StudentComplainTicketModule {}
