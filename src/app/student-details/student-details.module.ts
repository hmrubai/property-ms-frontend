import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { StudentDetailsComponent } from './student-details.component';
import { StudentDetailsRoutes } from './student-details.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
//import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(StudentDetailsRoutes),
      SharedModule,
      CollapseModule.forRoot(),
      //BsDropdownModule.forRoot()
  ],
  declarations: [StudentDetailsComponent]
})

export class StudentDetailsModule {}
