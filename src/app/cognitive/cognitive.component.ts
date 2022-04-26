import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import {DomSanitizer} from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { Page } from '../_models/page';


@Component({
    selector: 'app-cognitive',
    templateUrl: './cognitive.component.html',
    styleUrls: ['./cognitive.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class CognitiveComponent implements OnInit {

    baseUrl = environment.baseUrl;

    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    formTitle = 'Question List';
    btnSaveText = 'Save';
    updateButtonText = 'Update';
    modalTitle = 'Add Question';
    saveButtonText: string = 'Save';

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    emptyGuid = '00000000-0000-0000-0000-000000000000';
    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;

    is_update = false;

    scrollBarHorizontal = (window.innerWidth < 1200);

    subjectList = [];
    courseList = [];
    instructorList = [];
    complain_status = '';
    projectId = 4;

    projectList = [];
    questionList = [];

    complainList = [];

    userImage = '';

    type = 'both';

    status = [
        {
            id: 'both',
            name: 'Both'
        },
        {
            id: 'tutor',
            name: 'Tutor'
        },
        {
            id: 'guardian',
            name: 'Guardian'
        }
    ]

    constructor(
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private sanitizer:DomSanitizer,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private router: Router,
        private confirmService: ConfirmService,
        private modalService: BsModalService,
    ) {
        this.page.pageNumber = 1;
        this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };
    }


    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            title: [null, [Validators.required]],
            title_bn: [null, [Validators.required]],
            option1: [null, [Validators.required]],
            option1_bn: [null, [Validators.required]],
            option2: [null, [Validators.required]],
            option2_bn: [null, [Validators.required]],
            option3: [null],
            option3_bn: [null],
            option4: [null],
            option4_bn: [null],
            user_type: ['both', [Validators.required]],
        });

        this.getList();
        //this.getProjectListAdmin();
        //this.getSubjectList();
    }

    get f() {
        return this.entryForm.controls;
    }

    setImageUrl(imageFile){
        let image = this.baseUrl + '/uploads/images/profile/'+ imageFile;
        this.sanitize(image);
        return image;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    getSubjectList() {
        this._service.get('admin/subject/get-list').subscribe(res => {
            this.subjectList = res.data;
        }, err => { }
        );
    }

    getSubjectListByCourse(item){
        this._service.get('admin/subject/list/frontend/' + item.id).subscribe(res => {
            this.subjectList = res.data;
        }, err => { }
        );
    }

    getProjectListAdmin() {
        this._service.get('getProjectListAdmin').subscribe(res => {
            this.projectList = res;
        }, err => { }
        );
    }

    getList() {
        this.loadingIndicator = true;
        this._service.get('getCognitiveQuestionByUser/' + this.type).subscribe(res => {
            this.questionList = res;
            //console.log(res[0].title)
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
    filterList(){
        this.page.pageNumber=0;
        this.questionList=[];
        this.getList();
    }
    addNewQuestion(){
        //cognitive-question-multiple

        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Submitting data...');

        this._service.post('cognitive-question-multiple', [this.entryForm.value]).subscribe(
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

    deleteQuestion(question){
        let params = {
            id: question.id
        }

        this.confirmService.confirm('Are you sure?', 'Do you want to delete question?')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Deleting...');
                        this._service.post('cognitive-question-delete', params).subscribe(res => {
                            this.toastr.success(res.message, 'Successful!');
                            this.getList();
                            this.blockUI.stop();
                        }, err => {
                            this.blockUI.stop();
                        });
                    }
                }
            );

    }


    markAsSolved(complain){
        let params = {
            id: complain.id,
            status: "Solved",
        }

        this.confirmService.confirm('Are you sure?', 'Do you want to change the status?')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Updating...');
                        this._service.post('update-tutor-complain', params).subscribe(res => {
                            this.toastr.success(res.message, 'Successful!');
                            this.getList();
                            this.blockUI.stop();
                        }, err => {
                            this.blockUI.stop();
                        });
                    }
                }
            );
    }

    markAsDeclined(complain){
        let params = {
            id: complain.id,
            status: "Declined",
        }

        this.confirmService.confirm('Are you sure?', 'Do you want to change the status?')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Updating...');
                        this._service.post('update-tutor-complain', params).subscribe(res => {
                            this.toastr.success(res.message, 'Successful!');
                            this.getList();
                            this.blockUI.stop();
                        }, err => {
                            this.blockUI.stop();
                        });
                    }
                }
            );
    }

    deleteSolvedComplaint(){
        this.confirmService.confirm('Are you sure?', 'Do you want to Delete?')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Updating...');
                        this._service.post('delete-solved-complaint-ticket', null).subscribe(res => {
                            this.toastr.success(res.message, 'Successful!');
                            this.getList();
                            this.blockUI.stop();
                        }, err => {
                            this.blockUI.stop();
                        });
                    }
                }
            );
    }

    deleteDeclinedComplaint(){
        this.confirmService.confirm('Are you sure?', 'Do you want to Delete?')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Updating...');
                        this._service.post('delete-declined-complaint-ticket', null).subscribe(res => {
                            this.toastr.success(res.message, 'Successful!');
                            this.getList();
                            this.blockUI.stop();
                        }, err => {
                            this.blockUI.stop();
                        });
                    }
                }
            );
    }
    

    findInstructor(data, template: TemplateRef<any>){
        //console.log(data);
        this.modalTitle = 'Select Instructor';
        this.saveButtonText = 'Save';
        this._service.get('admin/teacher/list/as-instructor/' + data.id).subscribe(res => {
            if (!res.status) {
                this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
                return;
            }
            this.entryForm.controls['id'].setValue(data.id);
            this.instructorList = res.data
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }
        );
    }

    getItem(row) {
        this.getSubjectList();
        this.formTitle = 'Update Chapter';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(row.id);
        this.entryForm.controls['name_en'].setValue(row.chapter_name);
        this.entryForm.controls['course_id'].setValue(row.course_id);
        this.entryForm.controls['subject_id'].setValue(row.subject_id);
        this.entryForm.controls['is_active'].setValue(row.is_active);
    }

    ChangeStatus(value, job){
        let param = {
            status: value
        }
        this.blockUI.start('Updating...');
        const request = this._service.post('guardian-job-offer/' + job.id, param);
        request.subscribe(
            data => {
                this.blockUI.stop();
                this.getList();
                this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
            },
            err => {
                this.blockUI.stop();
                this.getList();
                this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            }
        );
    }

    onSetInstructorSubmit(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving...');

        const request = this._service.post('admin/set/instructor', this.entryForm.value);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.clearForm();
                    this.modalHide();
                    this.getList();
                    // this.getSubjectList();
                } else {
                    this.toastr.error(data.message, 'Error!', { closeButton: true, disableTimeOut: true });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            }
        );
    }

    DeleteJob(job){

        let params = 
        {
            id: job.id
        }

        this.confirmService.confirm('Are you sure?', 'Do you want to delete the job?')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Deleting Job...');
                        this._service.post('guardian-job-offer-delete', params).subscribe(res => {
                            this.toastr.success(res.message, 'Successful!');
                            this.getList();
                            this.blockUI.stop();
                        }, err => {
                            this.blockUI.stop();
                        });
                    }
                }
            );
    }

    SubmitQuestionUpdate(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Submitting data...');

        this._service.post('cognitive-question-update', this.entryForm.value).subscribe(
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

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving...');

        const obj = {
            id: this.entryForm.value.id ? this.entryForm.value.id : 0,
            name_en: this.entryForm.value.name_en.trim(),
            course_id: this.entryForm.value.course_id,
            subject_id: this.entryForm.value.subject_id,
            is_active: this.entryForm.value.is_active
        };

        const request = this._service.post('admin/chapter/save-or-update', obj);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.clearForm();
                    this.getList();
                    this.getSubjectList();
                } else {
                    this.toastr.error(data.message, 'Error!', { closeButton: true, disableTimeOut: true });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            }
        );

    }

    clearForm() {
        this.entryForm.reset();
        this.submitted = false;
        this.formTitle = 'Select Instructor';
        this.btnSaveText = 'Save';
    }

    sanitize(url:string){
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.submitted = false;
    }

    openModal(template: TemplateRef<any>) {
        this.is_update = false;
        this.modalTitle = 'Add Question';
        this.saveButtonText = 'Save';
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    openUpdateModal(question, template: TemplateRef<any>) {
        this.is_update = true;
        this.modalTitle = 'Update Question';
        this.updateButtonText = "Update"
        this.entryForm.controls['id'].setValue(question.id);
        this.entryForm.controls['title'].setValue(question.title);
        this.entryForm.controls['title_bn'].setValue(question.title_bn);
        this.entryForm.controls['option1'].setValue(question.option1);
        this.entryForm.controls['option1_bn'].setValue(question.option1_bn);
        this.entryForm.controls['option2'].setValue(question.option2);
        this.entryForm.controls['option2_bn'].setValue(question.option2_bn);
        this.entryForm.controls['option3'].setValue(question.option3);
        this.entryForm.controls['option3_bn'].setValue(question.option3_bn);
        this.entryForm.controls['option4'].setValue(question.option4);
        this.entryForm.controls['option4_bn'].setValue(question.option4_bn);
        this.entryForm.controls['user_type'].setValue(question.user_type);

        this.modalRef = this.modalService.show(template, this.modalConfig);
    }
}
