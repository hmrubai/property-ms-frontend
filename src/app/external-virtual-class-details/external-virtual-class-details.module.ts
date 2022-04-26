import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ExternalVirtualClassDetailsComponent } from './external-virtual-class-details.component';
import { ExternalVirtualClassDetailsRoutes } from './external-virtual-class-details.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ExternalVirtualClassDetailsRoutes),
      SharedModule
  ],
  declarations: [ExternalVirtualClassDetailsComponent]
})

export class ExternalVirtualClassDetailsModule {}
