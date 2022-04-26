import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecruitmentExamResultComponent } from './recruitment-exam-result.component';

describe('RecruitmentExamResultComponent', () => {
  let component: RecruitmentExamResultComponent;
  let fixture: ComponentFixture<RecruitmentExamResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentExamResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentExamResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
