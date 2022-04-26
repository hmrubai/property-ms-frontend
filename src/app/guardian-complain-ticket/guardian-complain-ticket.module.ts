import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { GuardianComplainTicketComponent } from './guardian-complain-ticket.component';
import { GuardianComplainTicketRoutes } from './guardian-complain-ticket.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(GuardianComplainTicketRoutes),
      SharedModule
  ],
  declarations: [GuardianComplainTicketComponent]
})

export class GuardianComplainTicketModule {}
