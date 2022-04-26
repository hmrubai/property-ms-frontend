import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ParticipantAnswerDetailsComponent } from './participants-answer-details.component';
import { ParticipantAnswerDetailsRoutes } from './participants-answer-details.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ParticipantAnswerDetailsRoutes),
      SharedModule,
      CollapseModule.forRoot(),
  ],
  declarations: [ParticipantAnswerDetailsComponent]
})

export class ParticipantAnswerDetailsModule {}
