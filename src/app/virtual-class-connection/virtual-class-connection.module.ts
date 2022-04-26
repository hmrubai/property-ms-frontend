import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VirtualClassConnectionComponent } from './virtual-class-connection.component';
import { VirtualClassConnectionRoutes } from './virtual-class-connection.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VirtualClassConnectionRoutes),
      SharedModule
  ],
  declarations: [VirtualClassConnectionComponent]
})

export class VirtualClassConnectionModule {}
