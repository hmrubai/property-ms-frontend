import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PackageAssignComponent } from './package-assign.component';
import { PackageAssignRoutes } from './package-assign.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PackageAssignRoutes),
      SharedModule

  ],
  declarations: [PackageAssignComponent]
})

export class PackageAssignModule {}
