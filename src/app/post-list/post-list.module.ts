import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PostListComponent } from './post-list.component';
import { PostListRoutes } from './post-list.routing';
import {SharedModule} from '../shared/shared.module';
import { NgxEditorModule } from 'ngx-editor';
// import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PostListRoutes),
      SharedModule,
      NgxEditorModule,
      // ImageCropperModule
  ],
  declarations: [PostListComponent]
})

export class PostListModule {}
