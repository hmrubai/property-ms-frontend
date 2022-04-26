import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { QuizDetailsComponent } from './quiz-details.component';
import { QuizDetailsRoutes } from './quiz-details.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(QuizDetailsRoutes),
      SharedModule
  ],
  declarations: [QuizDetailsComponent]
})

export class QuizDetailsModule {}
