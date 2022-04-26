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

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class BillListComponent implements OnInit {
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
  packageList: Array<any> = [];
  packageItemList: Array<any> = [];
  instituteList: Array<any> = [];
  studentList: Array<any> = [];

  roleTypes: Array<any> = [{ id: 'Institute', name: 'Institute' }, { id: 'Customer', name: 'Customer' }];
  paymentStatus: Array<any> = [{ id: 'Unpaid', name: 'Unpaid' }, { id: 'PartialPaid', name: 'Partial Paid' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  fromRowData:any;
  scrollBarHorizontal = (window.innerWidth < 1200);
  baseUrl = environment.baseUrl;

  selectedRoleType;
  selectedInstitute;
  selectedCustomer;
  selectedPaymentStatus;
  insertQty = 1;

  totalAmount:number =0;
  discount:number=0;
  payableAmount:number=0;
  paidAmound:number=0;

  itemObj:any;

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
    this.entryForm = this.formBuilder.group({
      id: [null],
      itemHistory: this.formBuilder.array([this.initItemHistory()]),
    });
    this.itemHistoryList = this.entryForm.get("itemHistory") as FormArray;
    this.itemFormArray = this.entryForm.get("itemHistory")["controls"];



    // this.getItemTypeList();
    // this.getPackageList();
  }

  get f() {
    return this.entryForm.controls;
  }

  get item_his(): FormArray {
    return this.entryForm.get("itemHistory") as FormArray;
  }

  initItemHistory() {
    return this.formBuilder.group({
      type: [null, [Validators.required]],
      bscs_item_id: [null, [Validators.required]],
      item_name: [null, [Validators.required]],
      unit_price: [null, [Validators.required]],
      qty: [null, [Validators.required]],
      price: [null, [Validators.required]],
    });
  }

  addItemHistory() {
    this.itemHistoryList.push(this.initItemHistory());
  }

  removeItemHistory(i) {
    if (this.itemHistoryList.length > 1) {
      this.itemHistoryList.removeAt(i);
    }
  }



  onCustomerTypeChange(e){
    this.instituteList = [];
    this.studentList = [];
    this.packageItemList = [];
    this.selectedPaymentStatus = null;
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




  onSearchSubmit() {
    this.loadingIndicator = true;

    const obj = {
      bscs_institute_id: this.selectedInstitute ? this.selectedInstitute : '',
      student_id : this.selectedCustomer ? this.selectedCustomer : '',
      bscs_package_id: '',
      status: this.selectedPaymentStatus
    };


    this._service.get('bscs/bill/list',obj).subscribe(res => {

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





  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }


    let bill_items = [];
    this.blockUI.start('Saving...');




    const obj = {
      bscs_institute_id: this.selectedInstitute ? this.selectedInstitute : null,
      student_id : this.selectedCustomer ? this.selectedCustomer : null,
      bscs_bill_id : this.itemObj.id,
      admin_id : this.currentUser.id,
      paid : Number(this.paidAmound),
      payment_method : "Cash"
    };


    this.confirmService.confirm('Are you sure?', 'You are paying the bill.')
    .subscribe(
        result => {
            if (result) {

                this._service.post('bscs/make-payment', obj).subscribe(
                  data => {
                    this.blockUI.stop();
                    if (data.status == "Ok") {
                      this.toastr.success(data.message, 'Success!', { closeButton: true, disableTimeOut: true });
                        this.formReset();
                        this.modalHide();
                        this.onSearchSubmit();

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






  formReset(){
    this.submitted = false;
    this.entryForm.reset();
    Object.keys(this.entryForm.controls).forEach(key => {
      this.entryForm.controls[key].setErrors(null)
    });
    let itemHistoryControl = <FormArray>(
      this.entryForm.controls.itemHistory
    );
    while (this.itemHistoryList.length !== 1) {
      itemHistoryControl.removeAt(0);
    }
    this.totalAmount=0;
    this.discount=0;
    this.payableAmount=0;
    this.paidAmound=0;

    this.itemObj = null;
  //   this.selectedRoleType = null;
  //   this.selectedInstitute = null;
  //   this.selectedCustomer = null;

  //  this.instituteList = [];
  //  this.studentList = [];

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






  getItem(item, template: TemplateRef<any>) {

    this.modalTitle = 'Pay Bill';
      this.btnSaveText = 'Pay';
      this.itemObj = item;

      if (item.items.length > 0) {
        let itemHistoryControl = <FormArray>(
          this.entryForm.controls.itemHistory
       );
        while (this.itemHistoryList.length !== 0) {
          itemHistoryControl.removeAt(0);
        }
        item.items.forEach(element => {
          // if(itemHistoryControl.length > 0 ){
            itemHistoryControl.push(
              this.formBuilder.group({
                type: new FormControl(element.name),
                bscs_item_id: new FormControl(element.bscs_item_id),
                item_name: new FormControl(element.title),
                unit_price: new FormControl(element.unit_price),
                qty: new FormControl(Number(element.qty)),
                price: new FormControl(Number(element.total_price))

              })
            );
          // }
        });
      }



      // this.entryForm.controls['id'].setValue(item.id);
      // this.entryForm.controls['title'].setValue(item.title);
      // this.entryForm.controls['description'].setValue(item.description);
      // this.entryForm.controls['mark'].setValue(item.mark);
      // this.entryForm.controls['min_word_count'].setValue(item.min_word_count);
      // this.entryForm.controls['max_word_count'].setValue(item.max_word_count);
      // this.entryForm.controls['unit_price'].setValue(item.unit_price);
      // this.entryForm.controls['bscs_item_type_id'].setValue(item.bscs_item_type_id);
      // this.entryForm.controls['is_active'].setValue(item.is_active);

      this.modalRef = this.modalService.show(template, this.modalConfig);

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
