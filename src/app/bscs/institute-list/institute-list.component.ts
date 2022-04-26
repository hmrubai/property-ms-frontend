import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../_services/common.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../../_models/page';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-institute-list',
  templateUrl: './institute-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class InstituteListComponent implements OnInit {
  currentUser: any = null;
  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Institute';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  rows = [];
  //roleTypes: Array<any> = [{ id: 'Anonymous', text: 'Anonymous' }, { id: 'Restricted', text: 'Restricted' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);
  baseUrl = environment.baseUrl;

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private _authService: AuthenticationService,
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
      name: [null, [Validators.required, Validators.maxLength(250)]],
      email: [null, [Validators.required, Validators.email]],
      phone_no: [null, [Validators.required]],
      address: [null, [Validators.required, Validators.maxLength(550)]],
      is_active: [true]


    });

    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }


  // setPage(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getList();
  // }




  getList() {
    this.loadingIndicator = true;
    this._service.get('bscs/institute/get-list').subscribe(res => {
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



  getItem(id, template: TemplateRef<any>) {
    this.blockUI.start('Getting data...');
    this._service.get('bscs/institute/get/' + id).subscribe(res => {
      this.blockUI.stop();
      if (res.status != 'Ok') {
        this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
        return;
      }

      this.modalTitle = 'Update Institute';
      this.btnSaveText = 'Update';

      this.entryForm.controls['id'].setValue(res.result.id);
      this.entryForm.controls['name'].setValue(res.result.name);
      this.entryForm.controls['email'].setValue(res.result.email);
      this.entryForm.controls['phone_no'].setValue(res.result.phone_no);
      this.entryForm.controls['address'].setValue(res.result.address);
      this.entryForm.controls['is_active'].setValue(res.result.is_active);
      this.modalRef = this.modalService.show(template, this.modalConfig);
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
    });
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
      email: this.entryForm.value.email ? this.entryForm.value.email.trim() : null,
      phone_no: this.entryForm.value.phone_no ? this.entryForm.value.phone_no.trim() : null,
      address: this.entryForm.value.address ? this.entryForm.value.address.trim() : null,
      is_active: this.entryForm.value.is_active,
      created_by:this.currentUser.id
    };




    this._service.post('bscs/institute/save-or-update', obj).subscribe(
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
    this.modalTitle = 'Create Institute';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.entryForm.controls['is_active'].setValue(true);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
