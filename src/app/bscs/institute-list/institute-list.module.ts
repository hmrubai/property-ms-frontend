import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InstituteListComponent } from './institute-list.component';
import { InstituteListRoutes } from './institute-list.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(InstituteListRoutes),
      SharedModule

  ],
  declarations: [InstituteListComponent]
})

export class InstituteListModule {}
