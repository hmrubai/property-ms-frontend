import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuard } from './_helpers/auth.guard';

export const AppRoutes: Routes = [

  { path: '', component: AdminLayoutComponent, loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./authentication/login-system-admin/login-system-admin.module').then(m => m.LoginSystemAdminModule),
      },
      {
        path: 'admin/register',
        loadChildren: () => import('./authentication/register-system-admin/register-system-admin.module')
          .then(m => m.RegisterSystemAdminModule),
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'rent-roll',
        loadChildren: () => import('./rent-roll/rent-roll.module').then(m => m.RentRollListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'stacking',
        loadChildren: () => import('./stacking/stacking.module').then(m => m.StackingListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'property-cost-management',
        loadChildren: () => import('./property-cost-management/property-cost-management.module').then(m => m.PropertyCostManagementModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'master/property-masters',
        loadChildren: () => import('./property-masters/property-masters.module').then(m => m.PropertyMasterListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'master/room-masters',
        loadChildren: () => import('./room-masters/room-masters.module').then(m => m.RoomMasterListModule),
        // canActivate: [AuthGuard]
      },
      
      // {
      //   path: 'change-password',
      //   loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'user-list',
      //   loadChildren: () => import('./user-list/user-list.module').then(m => m.UserListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'tutor-list',
      //   loadChildren: () => import('./tutor-list/tutor-list.module').then(m => m.TutorListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'guardian-list',
      //   loadChildren: () => import('./guardian-list/guardian-list.module').then(m => m.GuardianListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'guardian-details/:id',
      //   loadChildren: () => import('./guardian-details/guardian-details.module').then(m => m.GuardianDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'student-details/:id',
      //   loadChildren: () => import('./student-details/student-details.module').then(m => m.StudentDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'student-list',
      //   loadChildren: () => import('./student-list/student-list.module').then(m => m.StudentListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'correction-summary',
      //   loadChildren: () => import('./correction-summary/correction-summary.module').then(m => m.CorrectionSummaryModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat-correction-summary',
      //   loadChildren: () => import('./beat-correction-summary/beat-correction-summary.module').then(m => m.BEATCorrectionSummaryModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat-correction-list',
      //   loadChildren: () => import('./beat-correction-list/beat-correction-list.module').then(m => m.BEATCorrectionListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat-payment-list',
      //   loadChildren: () => import('./beat-payment-list/beat-payment-list.module').then(m => m.BEATPaymentListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat-purchase-list',
      //   loadChildren: () => import('./beat-purchase-list/beat-purchase-list.module').then(m => m.BEATPurchaseListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat-corrector-list',
      //   loadChildren: () => import('./beat-corrector-list/beat-corrector-list.module').then(m => m.BEATCorrectorListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat-collaborator-list',
      //   loadChildren: () => import('./beat-collaborator-list/beat-collaborator-list.module').then(m => m.BEATCollaboratorPaymentListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'wp-correction-list',
      //   loadChildren: () => import('./correction-list/correction-list.module').then(m => m.CorrectionListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'correction-details/:correction_id',
      //   loadChildren: () => import('./correction-details/correction-details.module').then(m => m.CorrectionDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'corrector-list',
      //   loadChildren: () => import('./corrector-list/corrector-list.module').then(m => m.CorrectorListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat/beat-promo-list',
      //   loadChildren: () => import('./beat-promo-list/beat-promo-list.module').then(m => m.BEATPromoListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat/sew-collaborator-list',
      //   loadChildren: () => import('./beat-collaborator-info/beat-collaborator-info.module').then(m => m.SEWCollaboratorInfoModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat-correction-details/:correction_id',
      //   loadChildren: () => import('./beat-correction-details/beat-correction-details.module').then(m => m.BEATCorrectionDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'corrector-details/:id',
      //   loadChildren: () => import('./corrector-details/corrector-details.module').then(m => m.CorrectorDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'written-practice-paragraph-details/:id',
      //   loadChildren: () => import('./written-practice-paragraph-details/written-practice-paragraph-details.module').then(m => m.WrittenPracticeParagraghDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'admission-test',
      //   loadChildren: () => import('./admission-test/admission-test.module').then(m => m.AdmissionTestModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'quiz-details/:id',
      //   loadChildren: () => import('./quiz-details/quiz-details.module').then(m => m.QuizDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'quiz-answer-details/:quizId/:studentId',
      //   loadChildren: () => import('./quiz-answer-details/quiz-answer-details.module').then(m => m.QuizAnswerDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'virtual-class-connection',
      //   loadChildren: () => import('./virtual-class-connection/virtual-class-connection.module').then(m => m.VirtualClassConnectionModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'virtual-class-history',
      //   loadChildren: () => import('./virtual-class-history/virtual-class-history.module').then(m => m.VirtualClassHistoryModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'virtual-class-details/:id',
      //   loadChildren: () => import('./virtual-class-details/virtual-class-details.module').then(m => m.VirtualClassDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'tutor-virtual-class-history/:tutorId',
      //   loadChildren: () => import('./tutor-virtual-class-history/tutor-virtual-class-history.module').then(m => m.TutorVirtualClassHistoryModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'student-virtual-class-history/:username',
      //   loadChildren: () => import('./student-virtual-class-history/student-virtual-class-history.module').then(m => m.StudentVirtualClassHistoryModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'recruitment-exams',
      //   loadChildren: () => import('./recruitment-exams/recruitment-exams.module').then(m => m.RecruitmentExamsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'recruitment-exam-questions',
      //   loadChildren: () => import('./recruitment-exam-questions/recruitment-exam-questions.module').then(m => m.RecruitmentExamQuestionsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'recruitment-written-exam/:exam_id',
      //   loadChildren: () => import('./recruitment-written-exam/recruitment-written-exam.module').then(m => m.RecruitmentWrittenExamModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'recruitment-exam-written-questions/:exam_id',
      //   loadChildren: () => import('./recruitment-exam-written-questions/recruitment-exam-written-questions.module').then(m => m.RecruitmentExamWrittenQuestionsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'recruitment-quota-list/:exam_id',
      //   loadChildren: () => import('./recruitment-quota-list/recruitment-quota-list.module').then(m => m.RecruitmentQuotaListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'recruitment-exam-result/:exam_id',
      //   loadChildren: () => import('./recruitment-exam-result/recruitment-exam-result.module').then(m => m.RecruitmentExamResultModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'external-virtual-class-history',
      //   loadChildren: () => import('./external-virtual-class-history/external-virtual-class-history.module').then(m => m.ExternalVirtualClassHistoryModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'tutor-external-virtual-class-history/:tutorId',
      //   loadChildren: () => import('./tutor-external-virtual-class-history/tutor-external-virtual-class-history.module').then(m => m.TutorExternaVirtualClassHistoryModule),
      //   // canActivate: [AuthGuard]
      // },{
      //   path: 'external-virtual-class-details/:id',
      //   loadChildren: () => import('./external-virtual-class-details/external-virtual-class-details.module').then(m => m.ExternalVirtualClassDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'virtual-class-duration',
      //   loadChildren: () => import('./virtual-class-duration/virtual-class-duration.module').then(m => m.VirtualClassDurationModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'virtual-class-dashboard/:id',
      //   loadChildren: () => import('./virtual-class-dashboard/virtual-class-dashboard.module').then(m => m.VirtualClassDashboardModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'student-external-virtual-class-history/:username',
      //   loadChildren: () => import('./student-external-virtual-class-history/student-external-virtual-class-history.module').then(m => m.StudentExternalVirtualClassHistoryModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'member-list',
      //   loadChildren: () => import('./member-list/member-list.module').then(m => m.MemberListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'job-list',
      //   loadChildren: () => import('./job-list/job-list.module').then(m => m.JobListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'applied-job-list',
      //   loadChildren: () => import('./applied-job-list/applied-job-list.module').then(m => m.AppliedJobListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'applied-job-details/:jobId',
      //   loadChildren: () => import('./applied-job-details/applied-job-details.module').then(m => m.AppliedJobDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'career-applied-list',
      //   loadChildren: () => import('./career-applied-list/career-applied-list.module').then(m => m.CareerAppliedListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'complain-ticket-list',
      //   loadChildren: () => import('./complain-ticket-list/complain-ticket-list.module').then(m => m.ComplainTicketListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'guardian-complain-ticket',
      //   loadChildren: () => import('./guardian-complain-ticket/guardian-complain-ticket.module').then(m => m.GuardianComplainTicketModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'student-complain-ticket',
      //   loadChildren: () => import('./student-complain-ticket/student-complain-ticket.module').then(m => m.StudentComplainTicketModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'promotions',
      //   loadChildren: () => import('./promotions/promotions.module').then(m => m.PromotionModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'course',
      //   loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'class',
      //   loadChildren: () => import('./class/class.module').then(m => m.ClassModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'student-institute',
      //   loadChildren: () => import('./student-institute/student-institute.module').then(m => m.studentInstituteModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'entrance-quiz',
      //   loadChildren: () => import('./entrance-quiz/entrance-quiz.module').then(m => m.EntranceQuizModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'entrance-quiz-details/:id',
      //   loadChildren: () => import('./entrance-quiz-details/entrance-quiz-details.module').then(m => m.EntranceQuizDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'cognitive',
      //   loadChildren: () => import('./cognitive/cognitive.module').then(m => m.CognitiveModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'assesment-list',
      //   loadChildren: () => import('./assesment-list/assesment-list.module').then(m => m.AssesmentListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'show-assesment-list/:id',
      //   loadChildren: () => import('./show-assesment-list/show-assesment-list.module').then(m => m.ShowAssesmentListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'assesment-result/:id',
      //   loadChildren: () => import('./assesment-result/assesment-result.module').then(m => m.AssesmentResultModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'assesment-participants/:id',
      //   loadChildren: () => import('./assesment-participants/assesment-participants.module').then(m => m.AssesmentParticipantsListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'assesment-participants-details/:id',
      //   loadChildren: () => import('./assesment-participants-details/assesment-participants-details.module').then(m => m.ParticipantDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'participants-answer-details/:studentId/:examId',
      //   loadChildren: () => import('./participants-answer-details/participants-answer-details.module').then(m => m.ParticipantAnswerDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'assesment-subject-wise-participants/:id',
      //   loadChildren: () => import('./assesment-subject-wise-participants/assesment-subject-wise-participants.module').then(m => m.SubjectWiseParticipantsListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'assesment-question-details/:assesmentId',
      //   loadChildren: () => import('./assesment-question-details/assesment-question-details.module').then(m => m.AssesmentQuestionDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'tutor-details/:id',
      //   loadChildren: () => import('./tutor-details/tutor-details.module').then(m => m.TutorDetailsModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat/beat-item-list',
      //   loadChildren: () => import('./beat-correction/beat-item-list/beat-item-list.module').then(m => m.BEATItemListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat/beat-item-type',
      //   loadChildren: () => import('./beat-correction/beat-item-type/beat-item-type.module').then(m => m.BEATItemTypeModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat/beat-package-list',
      //   loadChildren: () => import('./beat-correction/beat-package-list/beat-package-list.module').then(m => m.BEATPackageListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'beat-model-exam-list/:package_id',
      //   loadChildren: () => import('./beat-correction/beat-model-exam-list/beat-model-exam-list.module').then(m => m.BEATModelExamListModule),
      //   // canActivate: [AuthGuard]
      // },
      
     

      
      // {
      //   path: 'bscs/institute-list',
      //   loadChildren: () => import('./bscs/institute-list/institute-list.module').then(m => m.InstituteListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'bscs/institute-batch-list',
      //   loadChildren: () => import('./bscs/institute-batch-list/institute-batch-list.module').then(m => m.InstituteBatchListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'bscs/batch-student',
      //   loadChildren: () => import('./bscs/batch-student/batch-student.module').then(m => m.BatchStudentModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'bscs/item-list',
      //   loadChildren: () => import('./bscs/item-list/item-list.module').then(m => m.ItemListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'bscs/package-list',
      //   loadChildren: () => import('./bscs/package-list/package-list.module').then(m => m.PackageListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'bscs/package-assign',
      //   loadChildren: () => import('./bscs/package-assign/package-assign.module').then(m => m.PackageAssignModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'bscs/bill-list',
      //   loadChildren: () => import('./bscs/bill-list/bill-list.module').then(m => m.BillListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'bscs/payment-list',
      //   loadChildren: () => import('./bscs/payment-list/payment-list.module').then(m => m.PaymentListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'bscs/consumption-list',
      //   loadChildren: () => import('./bscs/consumption-list/consumption-list.module').then(m => m.ConsumptionListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'bscs/item-assign',
      //   loadChildren: () => import('./bscs/item-assign/item-assign.module').then(m => m.ItemAssignModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'bscs/institute-member-list',
      //   loadChildren: () => import('./bscs/institute-member-list/institute-member-list.module').then(m => m.InstituteMemberListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'blood-request-con',
      //   loadChildren: () => import('./blood-request-con/blood-request-con.module').then(m => m.BloodRequestConModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'post-list',
      //   loadChildren: () => import('./post-list/post-list.module').then(m => m.PostListModule),
      //   // canActivate: [AuthGuard]
      // },
      // {
      //   path: 'project-student-list/:id',
      //   loadChildren: () => import('./project-student-list/project-student-list.module').then(m => m.ProjectStudentListModule),
      //   // canActivate: [AuthGuard]
      // },
      /*{
        path: 'assesment-subject-wise-participants/:id',
        loadChildren: () => import('./assesment-subject-wise-participants/assesment-subject-wise-participants.module').then(m => m.SubjectWiseParticipantsListModule),
        // canActivate: [AuthGuard]
      },{
        path: 'assesment-subject-wise-participants/:id',
        loadChildren: () => import('./assesment-subject-wise-participants/assesment-subject-wise-participants.module').then(m => m.SubjectWiseParticipantsListModule),
        // canActivate: [AuthGuard]
      },{
        path: 'assesment-subject-wise-participants/:id',
        loadChildren: () => import('./assesment-subject-wise-participants/assesment-subject-wise-participants.module').then(m => m.SubjectWiseParticipantsListModule),
        // canActivate: [AuthGuard]
      },{
        path: 'assesment-subject-wise-participants/:id',
        loadChildren: () => import('./assesment-subject-wise-participants/assesment-subject-wise-participants.module').then(m => m.SubjectWiseParticipantsListModule),
        // canActivate: [AuthGuard]
      },{
        path: 'assesment-subject-wise-participants/:id',
        loadChildren: () => import('./assesment-subject-wise-participants/assesment-subject-wise-participants.module').then(m => m.SubjectWiseParticipantsListModule),
        // canActivate: [AuthGuard]
      },{
        path: 'assesment-subject-wise-participants/:id',
        loadChildren: () => import('./assesment-subject-wise-participants/assesment-subject-wise-participants.module').then(m => m.SubjectWiseParticipantsListModule),
        // canActivate: [AuthGuard]
      },{
        path: 'assesment-subject-wise-participants/:id',
        loadChildren: () => import('./assesment-subject-wise-participants/assesment-subject-wise-participants.module').then(m => m.SubjectWiseParticipantsListModule),
        // canActivate: [AuthGuard]
      },{
        path: 'assesment-subject-wise-participants/:id',
        loadChildren: () => import('./assesment-subject-wise-participants/assesment-subject-wise-participants.module').then(m => m.SubjectWiseParticipantsListModule),
        // canActivate: [AuthGuard]
      },{
        path: 'assesment-subject-wise-participants/:id',
        loadChildren: () => import('./assesment-subject-wise-participants/assesment-subject-wise-participants.module').then(m => m.SubjectWiseParticipantsListModule),
        // canActivate: [AuthGuard]
      },
      */
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
