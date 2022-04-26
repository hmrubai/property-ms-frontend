import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';
import { AuthenticationService } from './../_services/authentication.service';
import { MustMatch } from './../_helpers/must-match.validator';

// import * as moment from 'moment';

@Component({
    selector: 'app-entrance-quiz',
    templateUrl: './entrance-quiz.component.html',
    styleUrls: ['./entrance-quiz.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class EntranceQuizComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    modalTitle = 'Add New Quiz';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];

    page = new Page();

    quizList = [];
    classList = [];
    mediumList = [];
    masterCourseList = [];

    course = null;
    class = null;

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private authService: AuthenticationService,
        private toastr: ToastrService
    ) {
        this.page.pageNumber = 0;
        this.page.size = 15;
    }


    ngOnInit() {

        this.entryForm = this.formBuilder.group({
            medium_id: [null, [Validators.required]],
            master_course_id: [null, [Validators.required]],
            class_id: [null, [Validators.required]],
            name: [null, [Validators.required, Validators.maxLength(50)]],
            duration: [null, [Validators.required]],
            question_number: [null, [Validators.required]],
            positive_mark: [null, [Validators.required]],
            negative_mark: [null, [Validators.required]]
        });

        this.getList();
        this.getClassList();
        this.getMediumList();
        this.getMasterCourseList();
    }

    get f() {
        return this.entryForm.controls;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }


    getList() {
        this.loadingIndicator = true;
        this._service.get('getExamSetList/' + this.page.size + '/'+(this.page.pageNumber+1)).subscribe(res => {
            this.quizList = res.records;
            console.log(this.quizList)
            this.page.totalElements = res.total_count;
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

    getFilterList(){
        if(!this.course && !this.class){
            this.getList();
            return;
        }
        this.loadingIndicator = true;
        this._service.get('getExamSetListWithFilter/' + this.course + '/' + this.class + '/' + this.page.size + '/'+(this.page.pageNumber+1)).subscribe(res => {
            this.quizList = res.records;
            this.page.totalElements = res.total_number;
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

    getMediumList() {
        this._service.get('medium').subscribe(res => {
            this.mediumList = res;
        }, err => { }
        );
    }

    getClassList() {
        this._service.get('class').subscribe(res => {
            this.classList = res;
        }, err => { }
        );
    }


    getMasterCourseList() {
        this._service.get('master-course').subscribe(res => {
            this.masterCourseList = res;
        }, err => { }
        );
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving data...');
        this._service.post('exam-set', this.entryForm.value).subscribe(
            res => {
                this.blockUI.stop();
                this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                this.modalHide();
                this.getList();
            },
            error => {
                this.blockUI.stop();
            }
        );

    }

    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.isUpdate = false;
        this.submitted = false;
        this.modalTitle = 'Add New Quiz';
        this.saveButtonText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    getItem(id, template: TemplateRef<any>) {
        this.blockUI.start('Saving...');
        this._service.get('Account/GetUserById/' + id).subscribe(res => {
            this.blockUI.stop();
            if (!res.Success) {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.entryForm.controls['id'].setValue(res.Record.Id);
            this.entryForm.controls['FirstName'].setValue(res.Record.FirstName);
            this.entryForm.controls['LastName'].setValue(res.Record.LastName);
            this.entryForm.controls['Email'].setValue(res.Record.Email);
            this.entryForm.controls['IsActive'].setValue(res.Record.IsActive);
            this.entryForm.controls['Password'].setValue('********');
            this.entryForm.controls['ConfirmPassword'].setValue('********');

            this.modalTitle = 'Update User';
            this.saveButtonText = 'Update';
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
            this.blockUI.stop();
        }
        );
    }
}
