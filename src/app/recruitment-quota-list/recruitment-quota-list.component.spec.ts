import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecruitmentQuotaListComponent } from './recruitment-quota-list.component';

describe('RecruitmentQuotaListComponent', () => {
  let component: RecruitmentQuotaListComponent;
  let fixture: ComponentFixture<RecruitmentQuotaListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentQuotaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentQuotaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
