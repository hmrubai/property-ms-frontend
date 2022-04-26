import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CorrectorListComponent } from './corrector-list.component';
import { CorrectorListRoutes } from './corrector-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CorrectorListRoutes),
      SharedModule
  ],
  declarations: [CorrectorListComponent]
})

export class CorrectorListModule {}
