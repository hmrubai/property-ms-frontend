import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';
import {SharedModule} from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
FullCalendarModule.registerPlugins([
  dayGridPlugin,
]);

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(HomeRoutes),
      SharedModule,
      HighchartsChartModule,
      FullCalendarModule
  ],
  declarations: [HomeComponent]
})

export class HomeModule {}
