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
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ItemListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Item';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  rows = [];
  itemTypeList: Array<any> = [];
  //roleTypes: Array<any> = [{ id: 'Anonymous', text: 'Anonymous' }, { id: 'Restricted', text: 'Restricted' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);
  baseUrl = environment.baseUrl;

  selectedInstitute;
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
      title: [null, [Validators.required, Validators.maxLength(550)]],
      description: [null, [Validators.required, Validators.maxLength(250)]],
      mark: [null],
      min_word_count: [null,[Validators.required]],
      max_word_count: [null,[Validators.required]],
      unit_price: [null,[Validators.required]],
      bscs_item_type_id: [null, [Validators.required]],
      is_active: [true]
    });

    this.getItemTypeList();
    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }


  // setPage(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getList();
  // }

  getItemTypeList() {
    this._service.get('bscs/type/list').subscribe(res => {
      if (res.status != 'Ok') {
        this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.itemTypeList = res.result;
    }, err => { }
    );
  }



  getList() {
    this.loadingIndicator = true;
    // const obj ={
    //   instituteId : this.selectedInstitute ? this.selectedInstitute.id : null
    // }
    this._service.get('bscs/item/list').subscribe(res => {
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

    this.modalTitle = 'Update Item';
      this.btnSaveText = 'Update';

      this.entryForm.controls['id'].setValue(item.id);
      this.entryForm.controls['title'].setValue(item.title);
      this.entryForm.controls['description'].setValue(item.description);
      this.entryForm.controls['mark'].setValue(item.mark);
      this.entryForm.controls['min_word_count'].setValue(item.min_word_count);
      this.entryForm.controls['max_word_count'].setValue(item.max_word_count);
      this.entryForm.controls['unit_price'].setValue(item.unit_price);
      this.entryForm.controls['bscs_item_type_id'].setValue(item.bscs_item_type_id);
      this.entryForm.controls['is_active'].setValue(item.is_active);
      this.modalRef = this.modalService.show(template, this.modalConfig);

    // this.blockUI.start('Getting data...');
    // this._service.get('bscs/batch/get/' + id).subscribe(res => {
    //   this.blockUI.stop();
    //   if (res.status != 'Ok') {
    //     this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
    //     return;
    //   }

    //   this.modalTitle = 'Update Institute';
    //   this.btnSaveText = 'Update';

    //   this.entryForm.controls['id'].setValue(res.result.id);
    //   this.entryForm.controls['name'].setValue(res.result.name);
    //   this.entryForm.controls['institute_id'].setValue(res.result.institute.id);
    //   this.modalRef = this.modalService.show(template, this.modalConfig);
    // }, err => {
    //   this.blockUI.stop();
    //   this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
    // });
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }


    this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

    const obj = {
      id: this.entryForm.value.id ? this.entryForm.value.id : null,
      title: this.entryForm.value.title.trim(),
      description: this.entryForm.value.description.trim(),
      mark: this.entryForm.value.mark,
      min_word_count: this.entryForm.value.min_word_count,
      max_word_count: this.entryForm.value.max_word_count,
      unit_price: this.entryForm.value.unit_price,
      bscs_item_type_id: this.entryForm.value.bscs_item_type_id,
      is_active: this.entryForm.value.is_active
    };

    this._service.post('bscs/item/save-or-update', obj).subscribe(
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
    this.modalTitle = 'Create Item';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.entryForm.controls['is_active'].setValue(true);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
