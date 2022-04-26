import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjectStudentListComponent } from './project-student-list.component';
import { ProjectStudentListRoutes } from './project-student-list.routing';
import {SharedModule} from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ProjectStudentListRoutes),
      SharedModule,
      HighchartsChartModule
  ],
  declarations: [ProjectStudentListComponent]
})

export class ProjectStudentListModule {}
