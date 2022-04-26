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
import * as XLSX from 'xlsx';
import { ConfirmService } from '../../_helpers/confirm-dialog/confirm.service';

@Component({
  selector: 'app-batch-student',
  templateUrl: './batch-student.component.html',
  encapsulation: ViewEncapsulation.None
})

export class BatchStudentComponent implements OnInit {

  entryForm: FormGroup;
  studentUploadForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Batch';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  rows = [];
  instituteList: Array<any> = [];
  batchList: Array<any> = [];
  //roleTypes: Array<any> = [{ id: 'Anonymous', text: 'Anonymous' }, { id: 'Restricted', text: 'Restricted' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);
  baseUrl = environment.baseUrl;

  selectedInstitute = null;
  selectedBatch = null;
  batch;

  arrayBuffer:any;

  studentFile:File;
  studentUploadList:Array<any> = [];

  batchStudentFile:File;
  batchStudentUploadList:Array<any> = [];

  @ViewChild('uploadBatchStudent',{static:true}) uploadBatchStudent: ElementRef;
  @ViewChild('studentUpload',{static:true}) studentUpload: ElementRef;

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private confirmService: ConfirmService,
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
      institute_id: [null, [Validators.required]],
      batch_id: [null, [Validators.required]],
      file:[null, [Validators.required]],
    });

    this.studentUploadForm = this.formBuilder.group({
      id: [null],
      file:[null, [Validators.required]],
    });

    this.getInstituteList();
  //  this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }

  get u() {
    return this.studentUploadForm.controls;
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

  getBatchList(instuteId) {
    this._service.get('bscs/batch/get-list-by-institute-id/'+instuteId).subscribe(res => {
      if (res.status != 'Ok') {
        this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.batchList = res.result;
    }, err => { }
    );
  }


  uploadStudentFile(event)
  {
  this.studentFile= event.target.files[0];
  let fileReader = new FileReader();
  fileReader.readAsArrayBuffer(this.studentFile);
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
      this.studentUploadList = [];
      list.forEach((element,i) => {
          this.studentUploadList.push({
            name: element['name'].trim(),
            mobile_no: element['mobile_no'].trim(),
            email:element['email'] != undefined ? element['email'].trim() : null
          })
        });

  }
}

  uploadBatchStudentFile(event)
  {
  this.batchStudentFile= event.target.files[0];
  let fileReader = new FileReader();
  fileReader.readAsArrayBuffer(this.batchStudentFile);
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
      this.batchStudentUploadList = [];
      list.forEach((element,i) => {
          this.batchStudentUploadList.push({
            name: element['name'].trim(),
            mobile_no: element['mobile_no'].trim(),
            email:element['email'] != undefined ? element['email'].trim() : null
          })
        });

  }
}


clearStudentUpload(){
 // this.studentUpload.nativeElement.value = null;
  this.arrayBuffer = [];
  this.studentUploadList = [];
}

clearBatchStudentUpload(){
 // this.uploadBatchStudent.nativeElement.value = null;
  this.arrayBuffer = [];
  this.batchStudentUploadList = [];
}

onFilterInstituteChange(e){
  this.selectedBatch = null;
  this.batch = null;
  if(e){
    this.selectedInstitute = e;
    this.getBatchList(e.id);
    this.getList();
  }
}

onFilterBatchChange(e){
  if(e){
    this.selectedBatch = e;
    this.getList();
  }
}


onInstituteChange(e){
  this.entryForm.controls['batch_id'].setValue(null);
  if(e){
    this.getBatchList(e.id);
  }
}


  getList() {
    this.loadingIndicator = true;
    let obj;

    if(this.selectedBatch){
       obj ={
        instituteId : this.selectedInstitute.id,
        batchId : this.selectedBatch.id
      }
    }else{
       obj ={
        instituteId : this.selectedInstitute.id
      }
    }

    this._service.get('bscs/batch/get-batch-student-list',obj).subscribe(res => {
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
    this._service.get('bscs/batch/get/' + id).subscribe(res => {
      this.blockUI.stop();
      if (res.status != 'Ok') {
        this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
        return;
      }

      this.modalTitle = 'Update Institute';
      this.btnSaveText = 'Update';

      this.entryForm.controls['id'].setValue(res.result.id);
      this.entryForm.controls['name'].setValue(res.result.name);
      this.entryForm.controls['institute_id'].setValue(res.result.institute.id);
      this.modalRef = this.modalService.show(template, this.modalConfig);
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
    });
  }

  onStudentUploadFormSubmit() {
    this.submitted = true;
    if (this.studentUploadForm.invalid) {
      return;
    }

    if (this.studentUploadList.length == 0) {
      this.toastr.warning("No Student Found", 'Warning!', { closeButton: true, disableTimeOut: true });
      return;
    }

    this.blockUI.start('Uploading...');

    const obj = {
      students: this.studentUploadList
    };



    this._service.post('bscs/batch/check-found-student', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.status == 'Ok') {

          if(data.result.length > 0){
            this.confirmService.confirm( data.result.length + ' Student(s) Already Found?', 'Do you want to proceed?')
            .subscribe(
            result => {
                if (result) {

                  this._service.post('bscs/batch/create-student-account', obj).subscribe(
                    data => {
                      this.blockUI.stop();
                      if (data.status == 'Ok') {
                        this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                        this.modalHideStudent();

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
            );


          } else {

            this._service.post('bscs/batch/create-student-account', obj).subscribe(
              data => {
                this.blockUI.stop();
                if (data.status == 'Ok') {
                  this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                  this.modalHideStudent();

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
      }
    );

  }

  onBatchStudentUploadFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    if (this.batchStudentUploadList.length == 0) {
      this.toastr.warning("No Batch Student Found", 'Warning!', { closeButton: true, disableTimeOut: true });
      return;
    }

    this.blockUI.start('Uploading...');


    const obj = {
      bscs_institute_id: this.entryForm.value.institute_id,
      bscs_institute_batch_id: this.entryForm.value.batch_id,
      students: this.batchStudentUploadList
    };



    this._service.post('bscs/batch/check-not-found-student', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.status == 'Ok') {

          if(data.result.length > 0){
            this.confirmService.confirm( data.result.length + ' Student(s) Not Found?', 'Do you want to proceed?')
            .subscribe(
            result => {
                if (result) {

                  this._service.post('bscs/batch/connect-student', obj).subscribe(
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
            );


          } else {

            this._service.post('bscs/batch/connect-student', obj).subscribe(
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
      }
    );




    // this._service.post('bscs/batch/connect-student', obj).subscribe(
    //   data => {
    //     this.blockUI.stop();
    //     if (data.status == 'Ok') {
    //       this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
    //       this.modalHide();
    //       this.getList();

    //     } else {
    //       this.toastr.error(data.message, 'Error!', { timeOut: 2000 });
    //     }
    //   },
    //   err => {
    //     this.blockUI.stop();
    //     this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
    //   }
    // );

  }

  modalHide() {
    this.entryForm.reset();
    this.clearBatchStudentUpload();
    this.modalRef.hide();
    this.submitted = false;
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  modalHideStudent() {
    this.studentUploadForm.reset();
    this.clearStudentUpload();
    this.modalRef.hide();
    this.submitted = false;
    this.btnSaveText = 'Save';
  }

  openModalStudent(templateStudent: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templateStudent, this.modalConfig);
  }
}
