import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BloodRequestConComponent } from './blood-request-con.component';
import { BloodRequestConRoutes } from './blood-request-con.routing';
import {SharedModule} from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BloodRequestConRoutes),
      SharedModule,
      HighchartsChartModule
  ],
  declarations: [BloodRequestConComponent]
})

export class BloodRequestConModule {}
