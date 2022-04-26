import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ClassComponent } from './class.component';
import { ClassRoutes } from './class.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ClassRoutes),
      SharedModule
  ],
  declarations: [ClassComponent]
})

export class ClassModule {}
