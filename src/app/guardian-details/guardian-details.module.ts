import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { GuardianDetailsComponent } from './guardian-details.component';
import { GuardianDetailsRoutes } from './guardian-details.routing';
import {SharedModule} from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
//import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(GuardianDetailsRoutes),
      SharedModule,
      CollapseModule.forRoot(),
      //BsDropdownModule.forRoot()
  ],
  declarations: [GuardianDetailsComponent]
})

export class GuardianDetailsModule {}
