import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VirtualClassDetailsComponent } from './virtual-class-details.component';
import { VirtualClassDetailsRoutes } from './virtual-class-details.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VirtualClassDetailsRoutes),
      SharedModule
  ],
  declarations: [VirtualClassDetailsComponent]
})

export class VirtualClassDetailsModule {}
