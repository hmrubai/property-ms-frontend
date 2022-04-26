import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATPackageListComponent } from './beat-package-list.component';
import { BEATPackageListRoutes } from './beat-package-list.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATPackageListRoutes),
      SharedModule

  ],
  declarations: [BEATPackageListComponent]
})

export class BEATPackageListModule {}
