import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EntranceQuizDetailsComponent } from './entrance-quiz-details.component';
import { EntranceQuizDetailsRoutes } from './entrance-quiz-details.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(EntranceQuizDetailsRoutes),
      SharedModule
  ],
  declarations: [EntranceQuizDetailsComponent]
})

export class EntranceQuizDetailsModule {}
