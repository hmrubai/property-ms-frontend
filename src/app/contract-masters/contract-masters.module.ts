import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ContractMasterListComponent } from './contract-masters.component';
import { ContractMasterListRoutes } from './contract-masters.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ContractMasterListRoutes),
      SharedModule

  ],
  declarations: [ContractMasterListComponent]
})

export class ContractMasterListModule {}
