import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CognitiveComponent } from './cognitive.component';
import { CognitiveRoutes } from './cognitive.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CognitiveRoutes),
      SharedModule
  ],
  declarations: [CognitiveComponent]
})

export class CognitiveModule {}
