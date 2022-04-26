import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AssesmentListComponent } from './assesment-list.component';
import { AssesmentListRoutes } from './assesment-list.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AssesmentListRoutes),
      SharedModule,
      CollapseModule.forRoot(),
  ],
  declarations: [AssesmentListComponent]
})

export class AssesmentListModule {}
