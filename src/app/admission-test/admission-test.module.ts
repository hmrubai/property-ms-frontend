import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdmissionTestComponent } from './admission-test.component';
import { AdmissionTestRoutes } from './admission-test.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AdmissionTestRoutes),
      SharedModule
  ],
  declarations: [AdmissionTestComponent]
})

export class AdmissionTestModule {}
