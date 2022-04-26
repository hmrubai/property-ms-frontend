import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { QuizAnswerDetailsComponent } from './quiz-answer-details.component';
import { QuizAnswerDetailsRoutes } from './quiz-answer-details.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(QuizAnswerDetailsRoutes),
      SharedModule
  ],
  declarations: [QuizAnswerDetailsComponent]
})

export class QuizAnswerDetailsModule {}
