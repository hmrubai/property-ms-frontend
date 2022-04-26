import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TutorDetailsComponent } from './tutor-details.component';
import { TutorDetailsRoutes } from './tutor-details.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
//import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(TutorDetailsRoutes),
      SharedModule,
      CollapseModule.forRoot(),
      //BsDropdownModule.forRoot()
  ],
  declarations: [TutorDetailsComponent]
})

export class TutorDetailsModule {}
