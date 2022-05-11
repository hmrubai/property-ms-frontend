import { Routes } from '@angular/router';

import { AddContractMasterListComponent } from './add-contract-masters.component';

export const AddContractMasterListRoutes: Routes = [{
  path: '',
  component: AddContractMasterListComponent,
  data: {
    breadcrumb: 'Contract Information',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
