import { Routes } from '@angular/router';

import { RoomMasterListComponent } from './room-masters.component';

export const RoomMasterListRoutes: Routes = [{
  path: '',
  component: RoomMasterListComponent,
  data: {
    breadcrumb: 'Room List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
