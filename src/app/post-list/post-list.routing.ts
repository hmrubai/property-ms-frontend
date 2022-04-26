import { Routes } from '@angular/router';

import { PostListComponent } from './post-list.component';

export const PostListRoutes: Routes = [{
  path: '',
  component: PostListComponent,
  data: {
    breadcrumb: 'Post List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
