import { Routes } from '@angular/router';

import { ContractMasterListComponent } from './contract-masters.component';

export const ContractMasterListRoutes: Routes = [{
  path: '',
  component: ContractMasterListComponent,
  data: {
    breadcrumb: 'Contract List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
