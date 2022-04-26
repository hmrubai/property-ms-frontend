import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SubjectWiseParticipantsListComponent } from './assesment-subject-wise-participants.component';
import { SubjectWiseParticipantsListRoutes } from './assesment-subject-wise-participants.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SubjectWiseParticipantsListRoutes),
      SharedModule,
      CollapseModule.forRoot(),
  ],
  declarations: [SubjectWiseParticipantsListComponent]
})

export class SubjectWiseParticipantsListModule {}
