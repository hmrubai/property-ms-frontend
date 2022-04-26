import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { AuthenticationService } from '../_services/authentication.service';
import { MustMatch } from '../_helpers/must-match.validator';

// import * as moment from 'moment';

@Component({
    selector: 'app-admission-test',
    templateUrl: './admission-test.component.html',
    styleUrls: ['./admission-test.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AdmissionTestComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    modalTitle = 'New Exam';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];
    mediumList: Array<any> = [];
    projectList: Array<any> = [];
    batchList: Array<any> = [];

    page = new Page();

    quizList = [];

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private authService: AuthenticationService,
        private toastr: ToastrService
    ) {
        this.page.pageNumber = 1;
        this.page.size = 10;
    }


    ngOnInit() 
    {
        this.entryForm = this.formBuilder.group({
            project: [null, [Validators.required]],
            exam: [null, [Validators.required,Validators.maxLength(250)]],
            batch: [null, [Validators.required]],
            description: [null],
            duration: [null, [Validators.required]],
            number: [null, [Validators.required]],
            mark: [null],
            course: [null, [Validators.maxLength(250)]],
            subject: [null, [Validators.maxLength(250)]],
            paper: [null],
            answer: [null],
      
          });
        this.getList();
        this.getProjetList();
        this.getBatchList();
    }

    get f() {
        return this.entryForm.controls;
    }
    getProjetList() {
        this._service.get('getProjectList').subscribe(res => {
          this.projectList = res;
        }, err => {
          this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
      }
    
      getBatchList() {
        this._service.get('get-batch-list').subscribe(res => {
          this.batchList = res;
        }, err => {
          this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
      }
    
    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }


    checkParcentage(total, value){
        let rest = parseInt(total) - parseInt(value);
        console.log(rest);
    }


    getList() {
        this.loadingIndicator = true;
        this._service.get('get-batch-with-exam-list').subscribe(res => {
            // if (!res.status) {
            //     this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
            //     return;
            // }
            this.quizList = res;
            //console.log(this.studentList)
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

    secondsToDhms(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        
        var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    }

    onFormSubmit() {
        this.submitted = true;

        if (this.entryForm.invalid) {
            return;
        }
        const obj = {
            project_id: this.entryForm.value.project,
            batch_id: this.entryForm.value.batch,
            title: this.entryForm.value.exam.trim(),
            description: this.entryForm.value.description ? this.entryForm.value.description.trim() : null,
            duration: this.entryForm.value.duration,
            total_question: this.entryForm.value.number,
            mark: this.entryForm.value.mark,
            course_name: this.entryForm.value.course,
            subject_name: this.entryForm.value.subject,
        };

        let formData = new FormData(); 

        if(this.entryForm.value.paper){

            for (var i = 0; i < this.entryForm.value.paper.length; i++) {
                let file = this.entryForm.value.paper[i];
                formData.append("files[" + i + "]", file);
              }  
        }
        else{
            this.toastr.warning('Select an exam paper first', 'Warning!', { timeOut: 2000 });
            return;
        }
           
        if(this.entryForm.value.answer){
            formData.append("answer_model", this.entryForm.value.answer);
        }
        else{
            this.toastr.warning('Select an answer model', 'Warning!', { timeOut: 2000 });
            return;
        }

        formData.append("data", JSON.stringify(obj));

        this.blockUI.start('Saving data...');
        this._service.post('create-admission-exam', formData).subscribe(
            data => {
                this.blockUI.stop();
                this.submitted = false;
                if (data.status === "Ok") {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.entryForm.reset();
                    this.modalRef.hide();
                    this.getList();
                  } else {
                    this.toastr.warning(data.message, 'Warning!', { timeOut: 2000, closeButton: true, disableTimeOut: false });
                  }
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.message || err, 'Warning!', { timeOut: 2000, closeButton: true, disableTimeOut: false });
              }
        );
        
       
    }

    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.isUpdate = false;
        this.submitted = false;
        this.saveButtonText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    goToItemDetails(row){
        console.log(row);
    }

    onSelectUpoladExamPaper(event) {
        if (event.target.files.length > 0) {
          const file = [].slice.call(event.target.files);
          let totalSize = 0;
          file.forEach(element => {
            totalSize += Number(element.size)
            console.log(element.size)
            console.log(element.size / 1024 / 1024)
          });
          if (totalSize / 1024 / 1024 > 25) {
            event.target.value = null;
            this.toastr.warning('File size exceeded. Max file size is 25MB', 'Email', { timeOut: 2000 });
            return;
          }
          this.entryForm.patchValue({
            paper: file
          });
        }
      }
      onSelectUpoladAnswerModel(event) {
        if (event.target.files.length > 0) {
          const file = [].slice.call(event.target.files);
          let totalSize = 0;
          file.forEach(element => {
            totalSize += Number(element.size)
            console.log(element.size)
            console.log(element.size / 1024 / 1024)
          });
          if (totalSize / 1024 / 1024 > 25) {
            event.target.value = null;
            this.toastr.warning('File size exceeded. Max file size is 25MB', 'Email', { timeOut: 2000 });
            return;
          }
          this.entryForm.patchValue({
            answer: file
          });
        }
      }
}
