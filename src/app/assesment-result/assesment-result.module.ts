import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AssesmentResultComponent } from './assesment-result.component';
import { AssesmentResultRoutes } from './assesment-result.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AssesmentResultRoutes),
      SharedModule,
      CollapseModule.forRoot(),
  ],
  declarations: [AssesmentResultComponent]
})

export class AssesmentResultModule {}
