import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InstituteMemberListComponent } from './institute-member-list.component';
import { InstituteMemberListRoutes } from './institute-member-list.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(InstituteMemberListRoutes),
      SharedModule

  ],
  declarations: [InstituteMemberListComponent]
})

export class InstituteMemberListModule {}
