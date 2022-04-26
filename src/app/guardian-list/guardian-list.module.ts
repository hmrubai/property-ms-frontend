import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { GuardianListComponent } from './guardian-list.component';
import { GuardianListRoutes } from './guardian-list.routing';
import {SharedModule} from '../shared/shared.module';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(GuardianListRoutes),
      SharedModule,
      NgxEditorModule
  ],
  declarations: [GuardianListComponent]
})

export class GuardianListModule {}
