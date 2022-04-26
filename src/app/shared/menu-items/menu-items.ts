import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const MENUITEMS = [
  {
    label: 'Master Settings',
    main: [

      {
        state: 'master',
        name: 'Master Settings',
        type: 'sub',
        icon: 'ti-control-forward',
        children: [
          {
            state: 'institute-list',
            name: 'Property',
            icon: 'ti-control-forward'
          },
          {
            state: 'institute-member-list',
            name: 'Room',
            icon: 'ti-control-forward'
          },
          {
            state: 'institute-batch-list',
            name: 'Tenant',
            icon: 'ti-control-forward'
          },
        ]
      }
    ]
  },
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'icofont-dashboard',
        // permission: 'Admin,SuperAdmin,Moderator,sewCollaborator'
      },
      {
        state: 'rent-roll',
        name: 'Rent-roll',
        type: 'link',
        icon: 'ti-control-forward',
        // permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'stacking',
        name: 'Stacking',
        type: 'link',
        icon: 'ti-control-forward',
        // permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'property-cost-management',
        name: 'Property Cost Management',
        type: 'link',
        icon: 'ti-control-forward',
        // permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'contact-list',
        name: 'Contact List',
        type: 'link',
        icon: 'ti-control-forward',
        // permission: 'Admin,SuperAdmin,Moderator'
      },

      /*{
        state: 'guardian-list',
        name: 'Guardians',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'student-list',
        name: 'Students',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'correction-summary',
        name: 'WP Correction',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,eEduAdmin'
      },
      {
        state: 'beat-correction-summary',
        name: 'SEW Correction',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,eEduAdmin'
      },
      {
        state: 'beat-payment-list',
        name: 'SEW Payments',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'beat-purchase-list',
        name: 'SEW Purchases',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'beat-collaborator-list',
        name: 'SEW Collaboration',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,sewCollaborator'
      },
      {
        state: 'admission-test',
        name: 'Admission Test',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,eEduAdmin'
      },
      {
        state: 'virtual-class-connection',
        name: 'Virtual Class Connection',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,eEduAdmin'
      },
      {
        state: 'virtual-class-duration',
        name: 'BacBon Virtual Class',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,eEduAdmin'
      },
      {
        state: 'virtual-class-history',
        name: 'Bacbon Virtual Class History',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,eEduAdmin'
      },
      {
        state: 'virtual-class-dashboard',
        name: 'Coach Calling (Chart)',
        type: 'link',
        param:13,
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,eEduAdmin'
      },
      {
        state: 'virtual-class-dashboard',
        name: 'Virtual Class (Phase 6)',
        type: 'link',
        param:8,
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,eEduAdmin'
      },
      {
        state: 'external-virtual-class-history',
        name: 'Virtual Class History',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,eEduAdmin'
      },
      {
        state: 'assesment-list',
        name: 'Assesments',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator,eEduAdmin,Coach'
      },
      {
        state: 'member-list',
        name: 'Members',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'job-list',
        name: 'Jobs',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'applied-job-list',
        name: 'Applied Job List',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'career-applied-list',
        name: 'Career Applied List',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'recruitment-exams',
        name: 'Recruitment Exams',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'recruitment-exam-questions',
        name: 'Recruitment Question Bank',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'complain-ticket-list',
        name: 'Complain Tickets',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'guardian-complain-ticket',
        name: 'Guardian Tickets',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'student-complain-ticket',
        name: 'Student Tickets',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'promotions',
        name: 'Promotions',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'course',
        name: 'Course',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'class',
        name: 'Class',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'student-institute',
        name: 'Student Institute',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'entrance-quiz',
        name: 'Quiz',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'cognitive',
        name: 'Cognitve Questions',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },
      {
        state: 'post-list',
        name: 'Posts',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator'
      },*/
    ]
  },
  /*{
    label: 'SEW Settings',
    main: [
      {
        state: 'beat',
        name: 'SEW Correction',
        type: 'sub',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator',
        children: [
          {
            state: 'beat-item-type',
            name: 'SEW Item Type',
            icon: 'ti-control-forward'
          },
          {
            state: 'beat-package-list',
            name: 'SEW Packages',
            icon: 'ti-control-forward'
          },
          {
            state: 'beat-item-list',
            name: 'SEW Items',
            icon: 'ti-control-forward'
          },
          {
            state: 'sew-collaborator-list',
            name: 'SEW Collaborator List',
            icon: 'ti-control-forward'
          },
          {
            state: 'beat-promo-list',
            name: 'SEW Promo Items',
            icon: 'ti-control-forward'
          },
        ]
      }
    ]
  },*/

  /*{
    label: 'BSCS',
    main: [

      {
        state: 'bscs',
        name: 'BSCS Correction',
        type: 'sub',
        icon: 'ti-control-forward',
        children: [
          {
            state: 'institute-list',
            name: 'Institute',
            icon: 'ti-control-forward'
          },
          {
            state: 'institute-member-list',
            name: 'Institute Member',
            icon: 'ti-control-forward'
          },
          {
            state: 'institute-batch-list',
            name: 'Batch',
            icon: 'ti-control-forward'
          },
          {
            state: 'batch-student',
            name: 'Batch Students',
            icon: 'ti-control-forward'
          },
          {
            state: 'item-list',
            name: 'BSCS Item',
            icon: 'ti-control-forward'
          },
          {
            state: 'package-list',
            name: 'Packages',
            icon: 'ti-control-forward'
          },
          {
            state: 'package-assign',
            name: 'Package Assign',
            icon: 'ti-control-forward'
          },
          {
            state: 'bill-list',
            name: 'Bills',
            icon: 'ti-control-forward'
          },
          {
            state: 'payment-list',
            name: 'Payments',
            icon: 'ti-control-forward'
          },
          {
            state: 'item-assign',
            name: 'Item Assign',
            icon: 'ti-control-forward'
          },
          {
            state: 'consumption-list',
            name: 'Consumptions',
            icon: 'ti-control-forward'
          },

        ]
      }
    ]
  },*/
  /*{
    label: 'Configurations',
    main: [
      {
        state: 'blood-request-con',
        name: 'Blood Request',
        type: 'link',
        icon: 'ti-control-forward',
        permission: 'Admin,SuperAdmin,Moderator',
      }

    ]
  },*/
  // {
  //   label: 'Upload Contenst',
  //   permission: 'Admin,SuperAdmin,Moderator',
  //   main: [
  //     /*{
  //       state: 'script-upload',
  //       name: 'Upload Script',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin,SuperAdmin,Moderator'
  //     },
  //     {
  //       state: 'video-list',
  //       name: 'Upload Video',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin,SuperAdmin,Moderator'
  //     },
  //     {
  //       state: 'quiz-list',
  //       name: 'Upload Quiz',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin,SuperAdmin,Moderator'
  //     },
  //     {
  //       state: 'question-list',
  //       name: 'Quiz Question List',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin,SuperAdmin,Moderator'
  //     },*/
  //     // {
  //     //   state: 'check-inout',
  //     //   name: 'Check In/Out',
  //     //   type: 'link',room-cleaning
  //     //   icon: 'ti-control-forward',
  //     //   permission: 'Admin,SuperAdmin,Moderator'
  //     // },
  //     /*{
  //       state: 'payment',
  //       name: 'Payments',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin,SuperAdmin,Moderator'
  //     },
  //     {
  //       state: 'room-cleaning',
  //       name: 'Room Cleaning',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin,SuperAdmin,Moderator'
  //     }*/

  //   ]
  // },
  // {
  //   label: 'User Management',
  //   permission: 'Admin,SuperAdmin,Moderator',
  //   main: [
  //     /*{
  //       state: 'teacher-list',
  //       name: 'Teacher List',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin,SuperAdmin,Moderator'
  //     },
  //     {
  //       state: 'student-list',
  //       name: 'Student List',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin,SuperAdmin,Moderator'
  //     },
  //     {
  //       state: 'request-list',
  //       name: 'Instructor Request',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin,SuperAdmin,Moderator'
  //     },
  //     /*{
  //       state: 'question-list',
  //       name: 'Quiz Question List',
  //       type: 'link',
  //       icon: 'ti-control-forward',
  //       permission: 'Admin,SuperAdmin,Moderator'
  //     },*/

  //   ]
  // }

];

@Injectable()
export class MenuItems {
  private menu: Array<any> = MENUITEMS;
  getAll(): Menu[] {
    return this.menu;
  }

  refreshMenu(): void {
    this.menu = [];
    this.menu = MENUITEMS;
  }
  /*add(menu: Menu) {
    MENUITEMS.push(menu);
  }*/
}
