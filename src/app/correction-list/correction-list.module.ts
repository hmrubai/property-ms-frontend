import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CorrectionListComponent } from './correction-list.component';
import { CorrectionListRoutes } from './correction-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CorrectionListRoutes),
      SharedModule
  ],
  declarations: [CorrectionListComponent]
})

export class CorrectionListModule {}
