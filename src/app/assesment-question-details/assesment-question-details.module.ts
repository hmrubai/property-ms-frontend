import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AssesmentQuestionDetailsComponent } from './assesment-question-details.component';
import { AssesmentQuestionDetailsRoutes } from './assesment-question-details.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AssesmentQuestionDetailsRoutes),
      SharedModule,
      CollapseModule.forRoot(),
  ],
  declarations: [AssesmentQuestionDetailsComponent]
})

export class AssesmentQuestionDetailsModule {}
