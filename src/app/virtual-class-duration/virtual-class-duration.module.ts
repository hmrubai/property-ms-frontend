import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VirtualClassDurationComponent } from './virtual-class-duration.component';
import { VirtualClassDurationRoutes } from './virtual-class-duration.routing';
import {SharedModule} from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VirtualClassDurationRoutes),
      SharedModule,
      HighchartsChartModule
  ],
  declarations: [VirtualClassDurationComponent]
})

export class VirtualClassDurationModule {}
