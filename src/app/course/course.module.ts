import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CourseComponent } from './course.component';
import { CourseRoutes } from './course.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CourseRoutes),
      SharedModule
  ],
  declarations: [CourseComponent]
})

export class CourseModule {}
