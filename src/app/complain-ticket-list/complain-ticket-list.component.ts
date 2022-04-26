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
    selector: 'app-complain-ticket-list',
    templateUrl: './complain-ticket-list.component.html',
    styleUrls: ['./complain-ticket-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class ComplainTicketListComponent implements OnInit {

    baseUrl = environment.baseUrl;

    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    formTitle = 'Job List';
    btnSaveText = 'Save';

    modalTitle = 'Post a Job';
    saveButtonText: string = 'Save';

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    emptyGuid = '00000000-0000-0000-0000-000000000000';
    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;

    scrollBarHorizontal = (window.innerWidth < 1200);

    subjectList = [];
    courseList = [];
    instructorList = [];
    complain_status = '';
    projectId = 4;

    projectList = [];

    complainList = [];

    userImage = '';

    status = [
        {
            id: 'Pending',
            name: 'Pending'
        },
        {
            id: 'Solved',
            name: 'Solved'
        },
        {
            id: 'Declined',
            name: 'Declined'
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
        this.complain_status=this.status[0].id;
    }


    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            teacher_id: [null, [Validators.required]],
        });
        this.getList();
        this.getProjectListAdmin();
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
        let params = {
            pageSize: this.page.size,
            pageNumber: this.page.pageNumber,
            projectId: this.projectId,
            status: this.complain_status
        }
        this.loadingIndicator = true;
        this._service.get('get-complains-by-admin', params).subscribe(res => {
            this.complainList = res.records;
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
        this.modalTitle = 'Upload subject using xlsx';
        this.saveButtonText = 'Upload';
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }
}
