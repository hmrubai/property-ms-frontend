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
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PackageListComponent implements OnInit {
  currentUser: any = null;
  entryForm: FormGroup;
  featureHistoryList: FormArray;
  featureFormArray: any;

  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Package';
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
  @ViewChild('dataTable') table: any;

  arrayBuffer:any;
  itemFile:File;
  itemUploadList:Array<any> = [];

  packagePrice = 0;

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
      name: [null, [Validators.required, Validators.maxLength(550)]],
      features: this.formBuilder.array([this.initFeatureHistory()]),
      file:[null, [Validators.required]],
      price_of_package:[0,],
      previous_price:[null],
      promo:[null],
      description:[null,[Validators.required, Validators.maxLength(550)]],
      is_active: [true]
    });

    this.featureHistoryList = this.entryForm.get('features') as FormArray;
    this.featureFormArray = this.entryForm.get('features')['controls'];

    // this.getItemTypeList();
     this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }

  get f_his(): FormArray {
    return this.entryForm.get('features') as FormArray;
  }


  // setPage(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getList();
  // }


  uploadItemFile(event)
  {
  this.packagePrice = 0;
  this.itemFile= event.target.files[0];
  let fileReader = new FileReader();
  fileReader.readAsArrayBuffer(this.itemFile);
  fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, {type:"binary"});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      const list = XLSX.utils.sheet_to_json(worksheet);
      this.itemUploadList = [];
      list.forEach((element,i) => {
          this.packagePrice += Number(element['unit_price']);
          this.itemUploadList.push({
            bscs_item_id: element['id'],
            unit_price: element['unit_price']
          })
        //  if(element['add'] == 1){
        //   this.packagePrice += Number(element['unit_price']);
        //   this.itemUploadList.push({
        //     bscs_item_id: element['id'],
        //     unit_price: element['unit_price']
        //   })
        //  }

        });

        console.log(this.itemUploadList)
        console.log(this.packagePrice)

        this.entryForm.controls['price_of_package'].setValue(this.packagePrice);

  }
}


  /*** Feature  **/
  initFeatureHistory() {
    return this.formBuilder.group({
      feature_name: [null, [Validators.required]]
    });
  }

  addFeatureHistory() {
    this.featureHistoryList.push(this.initFeatureHistory());
  }

  removeFeatureHistory(i) {
    if (this.featureHistoryList.length > 1) {
      this.featureHistoryList.removeAt(i);
    }
  }


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

    this._service.get('bscs/package/list').subscribe(res => {
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

    this.modalTitle = 'Update Package';
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

    if(this.itemUploadList.length == 0){
      this.toastr.error('No item add from excel file', 'Error!', { timeOut: 2000 });
      return;
    }
  //  this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

    let features = [];
    this.featureHistoryList.value.forEach((element, key) => {
      if(element.feature_name == null){
        this.featureHistoryList.removeAt(key);
      }
      else
      {
        features.push(element.feature_name);
      }
    });


    const obj = {
      id: this.entryForm.value.id ? this.entryForm.value.id : null,
      name: this.entryForm.value.name.trim(),
      price_of_package: this.packagePrice,
      created_by: this.currentUser.id,
      items: this.itemUploadList,
      features: features,
      previous_price: this.entryForm.value.previous_price,
      promo: this.entryForm.value.promo,
      description: this.entryForm.value.description
    };


    this._service.post('bscs/item/check-not-found-item', {items:this.itemUploadList}).subscribe(
      data => {
        this.blockUI.stop();
        if (data.status == 'Ok') {
          if(data.result.length > 0){
            data.result
            this.toastr.warning( data.result+ ". Item not found", 'Warning!', { closeButton: true, disableTimeOut: true });
          } else {
            this._service.post('bscs/package/save-or-update', obj).subscribe(
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
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      }
    );





  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Create Package';
    this.btnSaveText = 'Save';
    this.packagePrice = 0;
  }

  openModal(template: TemplateRef<any>) {
    this.entryForm.controls['is_active'].setValue(true);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
