import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATCollaboratorPaymentListComponent } from './beat-collaborator-list.component';
import { BEATCollaboratorPaymentListRoutes } from './beat-collaborator-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATCollaboratorPaymentListRoutes),
      SharedModule
  ],
  declarations: [BEATCollaboratorPaymentListComponent]
})

export class BEATCollaboratorPaymentListModule {}
