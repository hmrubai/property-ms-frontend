import { Component,ChangeDetectionStrategy , TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
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
import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';


interface ITab {
  title: string;
  content: string;
  items: Array<any>;
  removable?: boolean;
  disabled?: boolean;
  active?: boolean;
  customClass?: string;
}

@Component({
  selector: 'app-item-assign',
 // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './item-assign.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ItemAssignComponent implements OnInit {

  @ViewChild('picker') picker: any;
  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = true;
  public enableMeridian = true;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';



  currentUser: any = null;
  entryForm: FormGroup;
  itemHistoryList: FormArray;
  itemFormArray: any;
  tabs: ITab[] =[];
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
  packageList: Array<any> = [];
  packageItemList: Array<any> = [];
  batchList: Array<any> = [];

  roleTypes: Array<any> = [{ id: 'Institute', name: 'Institute' }, { id: 'Customer', name: 'Customer' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  fromRowData:any;
  scrollBarHorizontal = (window.innerWidth < 1200);
  baseUrl = environment.baseUrl;

  selectedRoleType;
  selectedInstitute;
  selectedCustomer;
  selectedPackage;
  appearedData;
  inputCourse;


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


  }

  get f() {
    return this.entryForm.controls;
  }





  onCustomerTypeChange(e){
    this.rows = [];
    this.instituteList = [];
    this.studentList = [];
    this.batchList = [];
    this.packageList = [];
    this.packageItemList = [];
    this.selectedInstitute = null;
    this.selectedCustomer = null;
    this.selectedPackage = null;
    if(e.name == "Institute"){
      this.getInstituteList()
    }else {
      this.getStudentList()
    }

  }


  onInstituteChange(e){

    if(e){
      this.getBatchStudentsList(e.id);
      this.onSearchSubmit();
      this.selectedPackage = null;
      this.packageItemList = [];
      this.getPackageList();
    }
  }

  onStudentChange(e){

    if(e){
      this.selectedPackage = null;
      this.packageItemList = [];
      this.onSearchSubmit();
      this.getPackageList();
    }
  }


  onPackageChange(e){
    this.packageItemList = [];
    if(e){
      this.getPackageItemList(e.id);
    }
  }

  onSearchSubmit() {
    this.loadingIndicator = true;

    const obj = {
      bscs_institute_id: this.selectedInstitute ? this.selectedInstitute : '',
      student_id : this.selectedCustomer ? this.selectedCustomer : '',
      bscs_item_id : ''
    };

    this._service.get('bscs/consumption/details',obj).subscribe(res => {

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



  getBatchStudentsList(instituteId) {
    this.tabs = [];
    this.batchList = [];
    this.blockUI.start('Getting data...');
    this._service.get('bscs/batch/batch-student-list-by-institute-id/'+instituteId).subscribe(res => {
      this.blockUI.stop();
      if (res.status != 'Ok') {
        this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
        return;
      }

      res.result.forEach((element,i) => {
        let studuents = [];
        element.students.forEach((student:any) => {
          studuents.push({
            id: student.student_id,
            name: student.student_name,
            mobile_no: student.mobile_no,
            institute_id: element.bscs_institute_id,
            batch_id: element.id,
            selected:false
          })
        });

        this.batchList.push({
          name:element.name,
          studuents:studuents
        })

      });

      if(this.batchList.length > 0){
        this.batchList.forEach((element,i) => {
          const obj = {
            title:element.name,
            content:"test",
            active: i == 0 ? true :false,
            items:element.studuents
          }
          this.tabs.push(obj)
        });
      }






    }, err => {this.blockUI.stop(); }
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

  getPackageList() {
    this.packageList = [];
    const obj = {
      bscs_institute_id: this.selectedInstitute ? this.selectedInstitute : '',
      student_id : this.selectedCustomer ? this.selectedCustomer : '',
    }
    this._service.get('bscs/package/list-by-id',obj).subscribe(res => {
      this.packageList = res;
    }, err => { }
    );
  }

  getPackageItemList(packageId) {
    const obj = {
      bscs_institute_id: this.selectedInstitute ? this.selectedInstitute : '',
      student_id : this.selectedCustomer ? this.selectedCustomer : '',
      bscs_package_id:packageId
    }
    this._service.get('bscs/package/all-item-list-by-id',obj).subscribe(res => {

      res.forEach((element,i) => {
        this.packageItemList.push({
          bscs_item_id:element.bscs_item_id,
          type:element.type,
          title:element.title,
          description:element.description,
          remaining:element.remaining,
          selected:false
        })
      });

    }, err => { }
    );
  }


  onFormSubmit() {
    // this.submitted = true;
    // if (this.entryForm.invalid) {
    //   return;
    // }

    // this.fromRowData.itemHistory.filter(x => x.sim && x.sim_iccid && x.amount).forEach(element => {
    //   sim_sales_details.push({
    //     sim: element.sim.id,
    //     ICCID_no: element.sim_iccid,
    //     sim_cost: Number(element.amount)
    //   });
    // });

    if(!this.selectedInstitute && !this.selectedCustomer){
      this.toastr.warning('No Customer Selected', 'Warning!', { closeButton: true, disableTimeOut: false });
      return;
    }

    let bscs_students = [];
    if(this.selectedCustomer){
      bscs_students.push({
        institute_id : null,
        batch_id : null,
        id : this.selectedCustomer
      });
    }else{
      this.batchList.forEach(batch => {
        batch.studuents.filter(x => x.selected).forEach(stud => {
          bscs_students.push({
            institute_id : stud.institute_id,
            batch_id : stud.batch_id,
            id : stud.id
          });
        });
      });
    }


    if(bscs_students.length == 0){
      this.toastr.warning('Please select a student', 'Warning!', { closeButton: true, disableTimeOut: false });
      return;
    }


    let bscs_items = [];
    this.packageItemList.filter(x => x.selected).forEach(element => {
      bscs_items.push(element.bscs_item_id);
    });

    if(bscs_items.length == 0){
      this.toastr.warning('Please select a item', 'Warning!', { closeButton: true, disableTimeOut: false });
      return;
    }



    if(!this.inputCourse){
      this.toastr.warning('Please insert course name', 'Warning!', { closeButton: true, disableTimeOut: false });
      return;
    }


    if(!this.appearedData){
      this.toastr.warning('Please select appeared date', 'Warning!', { closeButton: true, disableTimeOut: false });
      return;
    }

    this.blockUI.start('Saving...');
    const obj = {
      bscs_institute_id: this.selectedInstitute ? this.selectedInstitute : null,
      student_id : this.selectedCustomer ? this.selectedCustomer : null,
      bscs_item_id : bscs_items,
      assigned_student_ids: bscs_students,
      user_id : this.currentUser.id,
      course_name : this.inputCourse,
      appeared_date : this.appearedData._d
    };


    this.confirmService.confirm('Are you sure?', 'You are assigning item.')
    .subscribe(
        result => {
            if (result) {
              this.blockUI.stop();
              console.log(obj);
                this._service.post('bscs/assign-paid-correction', obj).subscribe(
                  data => {
                    this.blockUI.stop();
                    if (data.status == "Ok") {
                      this.toastr.success(data.message, 'Success!', { closeButton: true, disableTimeOut: true });
                      this.resetFields();
                    } else {
                      this.toastr.error(data.message, 'Error!',  { closeButton: true, disableTimeOut: true });
                    }
                  },
                  err => {
                    this.blockUI.stop();
                    this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
                  }
                );

            }
            else{
                this.blockUI.stop();
            }
        },

    );

  }

resetFields(){
  this.rows = [];
  this.instituteList = [];
  this.studentList = [];
  this.batchList = [];
  this.packageList = [];
  this.packageItemList = [];
  this.selectedRoleType = null;
  this.selectedInstitute = null;
  this.selectedCustomer = null;
  this.selectedPackage = null;
  this.inputCourse = null;
  this.appearedData = null;

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
