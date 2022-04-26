import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VirtualClassDashboardComponent } from './virtual-class-dashboard.component';
import { VirtualClassDashboardRoutes } from './virtual-class-dashboard.routing';
import {SharedModule} from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VirtualClassDashboardRoutes),
      SharedModule,
      HighchartsChartModule
  ],
  declarations: [VirtualClassDashboardComponent]
})

export class VirtualClassDashboardModule {}
