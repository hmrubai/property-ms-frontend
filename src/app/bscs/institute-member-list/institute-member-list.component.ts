import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../../_models/page';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-institute-member-list',
  templateUrl: './institute-member-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class InstituteMemberListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Institute Member';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  rows = [];
  instituteList: Array<any> = [];
  //roleTypes: Array<any> = [{ id: 'Anonymous', text: 'Anonymous' }, { id: 'Restricted', text: 'Restricted' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);
  baseUrl = environment.baseUrl;

  selectedInstitute = null;
  itemObj:any;
  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // this.page.pageNumber = 0;
    // this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.maxLength(250)]],
      mobile_no: [null, [Validators.required]],
      email: [null, [Validators.required,Validators.email]],
      password: [null, [Validators.required]],
      bscs_institute_id: [null, [Validators.required]]

    });
    this.getInstituteList();
    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }


  // setPage(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getList();
  // }

  getInstituteList() {
    this._service.get('bscs/institute/get-dropdown-list').subscribe(res => {
      if (res.status != 'Ok') {
        this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.instituteList = res.result;
    }, err => { }
    );
  }

  onInstituteChange(e){
    if(e){
      this.selectedInstitute = e;
      this.getList();
    }
  }


  getList() {
    this.loadingIndicator = true;
    const obj ={
      instituteId : this.selectedInstitute ? this.selectedInstitute.id : ''
    }
    this._service.get('bscs/institute-member/get-list',obj).subscribe(res => {
      if (res.status != 'Ok') {
        this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.rows = res.result;
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



  getItem(item, template: TemplateRef<any>) {
    this.itemObj = item
    this.modalTitle = 'Update Institute Member';
      this.btnSaveText = 'Update';

      this.entryForm.controls['id'].setValue(item.id);
      this.entryForm.controls['name'].setValue(item.name);
      this.entryForm.controls['mobile_no'].setValue(item.mobile_no);
      this.entryForm.controls['email'].setValue(item.email);
      this.entryForm.controls['password'].setValue(item.raw_password);
      this.entryForm.controls['bscs_institute_id'].setValue(item.bscs_institute_id);
      this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }


    this.blockUI.start('Saving...');

    const obj = {
      id: this.entryForm.value.id ? this.entryForm.value.id : null,
      name: this.entryForm.value.name.trim(),
      mobile_no: this.entryForm.value.mobile_no.trim(),
      password: this.entryForm.value.password.trim(),
      email: this.entryForm.value.email.trim(),
      bscs_institute_id: this.entryForm.value.bscs_institute_id
    };

    this._service.post('bscs/institute-member/create-or-member', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.status == 'Ok') {
          this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
          this.modalHide();
          this.getList();

        } else {
          this.toastr.error(data.message, 'Error!', { timeOut: 2000 });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Create Institute Member';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    // this.entryForm.controls['is_active'].setValue(true);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
