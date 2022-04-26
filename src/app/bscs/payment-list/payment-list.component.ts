import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../_services/common.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../../_models/page';
import { environment } from '../../../environments/environment';
import { ConfirmService } from '../../_helpers/confirm-dialog/confirm.service';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PaymentListComponent implements OnInit {
  currentUser: any = null;
  entryForm: FormGroup;
  itemHistoryList: FormArray;
  itemFormArray: any;

  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Package';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  rows = [];

  instituteList: Array<any> = [];
  studentList: Array<any> = [];

  roleTypes: Array<any> = [{ id: 'Institute', name: 'Institute' }, { id: 'Customer', name: 'Customer' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  fromRowData:any;
  scrollBarHorizontal = (window.innerWidth < 1200);
  baseUrl = environment.baseUrl;

  selectedRoleType;
  selectedInstitute;
  selectedCustomer;

  bsConfig: Partial<BsDaterangepickerConfig>;
  bsValue: Date[] = [];

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private _authService: AuthenticationService,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // this.page.pageNumber = 0;
    // this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
    this._authService.currentUserDetails.subscribe((value) => {
      this.currentUser = value;
    });
  }


  ngOnInit() {

    // this.getItemTypeList();
    // this.getPackageList();

    this.bsValue = null;
    this.bsConfig = Object.assign({}, {
      isAnimated: true,
      adaptivePosition: true,
      rangeInputFormat: 'DD MMM YYYY',
      maxDate: new Date()
    });

  }

  get f() {
    return this.entryForm.controls;
  }






  onCustomerTypeChange(e){
    this.instituteList = [];
    this.studentList = [];
    this.selectedInstitute = null;
    this.selectedCustomer = null;
    if(e.name == "Institute"){
      this.getInstituteList()
    }else {
      this.getStudentList()
    }

  }


  // onPackageChange(e){
  //   console.log(e);
  //   this.packageItemList = [];
  //   if(e){
  //     this.getPackageItemList(e.id);
  //   }
  // }

  onClearSearch(){
    this.bsValue = null;
    this.onSearchSubmit();
  }


  onSearchSubmit() {
    this.loadingIndicator = true;

    const obj = {
      bscs_institute_id: this.selectedInstitute ? this.selectedInstitute : '',
      student_id : this.selectedCustomer ? this.selectedCustomer : '',
      start_date: this.bsValue ? moment(this.bsValue[0]).format("DD-MMM-YYYY") : '',
      end_date: this.bsValue ? moment(this.bsValue[1]).format("DD-MMM-YYYY")  : ''
    };

    this._service.get('bscs/payment/list',obj).subscribe(res => {

      this.rows = res;
      // this.page.totalElements = res.Total;
      // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }



  getInstituteList() {
    this.blockUI.start('Getting data...');
    this._service.get('bscs/institute/get-dropdown-list').subscribe(res => {
      this.blockUI.stop();
      if (res.status != 'Ok') {
        this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.instituteList = res.result;

    }, err => {this.blockUI.stop(); }
    );
  }

  getStudentList() {
    this.blockUI.start('Getting data...');
    this._service.get('studentDropdownList').subscribe(res => {
      this.studentList = res;
      this.blockUI.stop();
    }, err => {this.blockUI.stop(); }
    );
  }






  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Pay Bill';
    this.btnSaveText = 'Pay';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
