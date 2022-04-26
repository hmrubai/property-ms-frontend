import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InstituteBatchListComponent } from './institute-batch-list.component';
import { InstituteBatchListRoutes } from './institute-batch-list.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(InstituteBatchListRoutes),
      SharedModule

  ],
  declarations: [InstituteBatchListComponent]
})

export class InstituteBatchListModule {}
