import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ComplainTicketListComponent } from './complain-ticket-list.component';
import { ComplainTicketListRoutes } from './complain-ticket-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ComplainTicketListRoutes),
      SharedModule
  ],
  declarations: [ComplainTicketListComponent]
})

export class ComplainTicketListModule {}
