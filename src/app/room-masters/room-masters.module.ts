import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RoomMasterListComponent } from './room-masters.component';
import { RoomMasterListRoutes } from './room-masters.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RoomMasterListRoutes),
      SharedModule

  ],
  declarations: [RoomMasterListComponent]
})

export class RoomMasterListModule {}
