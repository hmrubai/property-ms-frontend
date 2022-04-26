import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { studentInstituteComponent } from './student-institute.component';
import { ClassRoutes } from './student-institute.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ClassRoutes),
      SharedModule
  ],
  declarations: [studentInstituteComponent]
})

export class studentInstituteModule {}
