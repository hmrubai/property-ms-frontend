import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentQuotaListRoutingModule } from './recruitment-quota-list-routing.module';
import { RecruitmentQuotaListComponent } from './recruitment-quota-list.component';
import { SharedModule } from '../shared/shared.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [RecruitmentQuotaListComponent],
  imports: [
    CommonModule,
    RecruitmentQuotaListRoutingModule,
    SharedModule,
    CollapseModule.forRoot(),
  ]
})
export class RecruitmentQuotaListModule { }
