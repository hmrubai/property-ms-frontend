import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AssesmentParticipantsListComponent } from './assesment-participants.component';
import { AssesmentParticipantsListRoutes } from './assesment-participants.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AssesmentParticipantsListRoutes),
      SharedModule,
      CollapseModule.forRoot(),
  ],
  declarations: [AssesmentParticipantsListComponent]
})

export class AssesmentParticipantsListModule {}
