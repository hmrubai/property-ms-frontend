import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AddContractMasterListComponent } from './add-contract-masters.component';
import { AddContractMasterListRoutes } from './add-contract-masters.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AddContractMasterListRoutes),
      SharedModule

  ],
  declarations: [AddContractMasterListComponent]
})

export class AddContractMasterListModule {}
