import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TenantMasterListComponent } from './tenant-masters.component';
import { TenantMasterListRoutes } from './tenant-masters.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(TenantMasterListRoutes),
      SharedModule

  ],
  declarations: [TenantMasterListComponent]
})

export class TenantMasterListModule {}
