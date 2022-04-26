import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ShowAssesmentListComponent } from './show-assesment-list.component';
import { ShowAssesmentListRoutes } from './show-assesment-list.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ShowAssesmentListRoutes),
      SharedModule,
      CollapseModule.forRoot(),
  ],
  declarations: [ShowAssesmentListComponent]
})

export class ShowAssesmentListModule {}
