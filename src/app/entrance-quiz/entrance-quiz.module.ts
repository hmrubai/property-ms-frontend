import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EntranceQuizComponent } from './entrance-quiz.component';
import { EntranceQuizRoutes } from './entrance-quiz.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(EntranceQuizRoutes),
      SharedModule
  ],
  declarations: [EntranceQuizComponent]
})

export class EntranceQuizModule {}
