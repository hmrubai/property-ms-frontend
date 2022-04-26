import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecruitmentExamQuestionsComponent } from './recruitment-exam-questions.component';

describe('RecruitmentExamQuestionsComponent', () => {
  let component: RecruitmentExamQuestionsComponent;
  let fixture: ComponentFixture<RecruitmentExamQuestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentExamQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentExamQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
