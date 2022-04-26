import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ParticipantDetailsComponent } from './assesment-participants-details.component';
import { ParticipantDetailsRoutes } from './assesment-participants-details.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ParticipantDetailsRoutes),
      SharedModule,
      CollapseModule.forRoot(),
  ],
  declarations: [ParticipantDetailsComponent]
})

export class ParticipantDetailsModule {}
