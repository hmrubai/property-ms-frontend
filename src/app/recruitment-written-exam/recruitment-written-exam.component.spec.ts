import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecruitmentWrittenExamComponent } from './recruitment-written-exam.component';

describe('RecruitmentWrittenExamComponent', () => {
  let component: RecruitmentWrittenExamComponent;
  let fixture: ComponentFixture<RecruitmentWrittenExamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentWrittenExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentWrittenExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
