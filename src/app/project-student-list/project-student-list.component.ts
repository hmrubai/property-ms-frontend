import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import * as Highcharts from 'highcharts';
import { Page } from './../_models/page';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-project-student-list',
    templateUrl: './project-student-list.component.html',
    styleUrls: ['./project-student-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class ProjectStudentListComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    loadingIndicator = false;

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;
  
    studentList = [];
    page = new Page();
    id: any;
    ColumnMode = ColumnMode;

    constructor(
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
     this.id = this.route.snapshot.paramMap.get("id");
     this.page.pageNumber = 0;
        this.page.size = 10;
   //   this.router.routeReuseStrategy.shouldReuseRoute = function () {
   //    return false;
   //  };
    }
  

    ngOnInit() {
      this.getList();
     
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
    }

    getList() {
      this.loadingIndicator = true;
      const obj ={
        projectId : this.id
      }
      this._service.get('get-e-edu-bae-student-list',obj ).subscribe(res => {
          // if (!res.status) {
          //     this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
          //     return;
          // }
          this.studentList = res;
          this.page.totalElements = res.length;
          setTimeout(() => {
              this.loadingIndicator = false;
          }, 1000);
      }, err => {
          this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
          setTimeout(() => {
              this.loadingIndicator = false;
          }, 1000);
      }
      );
  }
  
   
}
