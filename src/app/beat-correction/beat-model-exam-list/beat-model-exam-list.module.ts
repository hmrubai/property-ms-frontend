import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BEATModelExamListComponent } from './beat-model-exam-list.component';
import { BEATModelExamListRoutes } from './beat-model-exam-list.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BEATModelExamListRoutes),
      SharedModule

  ],
  declarations: [BEATModelExamListComponent]
})

export class BEATModelExamListModule {}
