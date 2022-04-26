import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PropertyMasterListComponent } from './property-masters.component';
import { PropertyMasterListRoutes } from './property-masters.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PropertyMasterListRoutes),
      SharedModule

  ],
  declarations: [PropertyMasterListComponent]
})

export class PropertyMasterListModule {}
