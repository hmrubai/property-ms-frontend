import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SEWCollaboratorInfoComponent } from './beat-collaborator-info.component';
import { SEWCollaboratorInfoRoutes } from './beat-collaborator-info.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SEWCollaboratorInfoRoutes),
      SharedModule
  ],
  declarations: [SEWCollaboratorInfoComponent]
})

export class SEWCollaboratorInfoModule {}
