import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecruitmentExamWrittenQuestionsComponent } from './recruitment-exam-written-questions.component';

describe('RecruitmentExamWrittenQuestionsComponent', () => {
  let component: RecruitmentExamWrittenQuestionsComponent;
  let fixture: ComponentFixture<RecruitmentExamWrittenQuestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentExamWrittenQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentExamWrittenQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
