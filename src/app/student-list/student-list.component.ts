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
import { Editor, Toolbar } from "ngx-editor";
// import * as moment from 'moment';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class StudentListComponent implements OnInit {

    entryForm: FormGroup;
    emailForm: FormGroup;
    notificationForm: FormGroup;
    submitted = false;
    modalTitle = 'Add Student';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];
    selectedStudentIds = [];
    selectedStudentsList = [];

    page = new Page();
    search = "";

    studentList = [];
    classList = [];
    genderList = [{ id: 'Male', name: 'Male' }, { id: 'Female', name: 'Female' }];

    bodyImage: any;
    notificationImage: any;
    attachmentfiles: any;

    editor: Editor;
    toolbar: Toolbar = [
        ["bold", "italic"],
        ["underline", "strike"],
        ["code", "blockquote"],
        ["ordered_list", "bullet_list"],
        [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    
        ["text_color", "background_color"],
        ["align_left", "align_center", "align_right", "align_justify"]
      ];

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }


    ngOnInit() {
        this.editor = new Editor();
        this.entryForm = this.formBuilder.group({
            id: [null],
            email: [null, [Validators.required]],
            name: [null, [Validators.required, Validators.maxLength(250)]],
            phone: [null, [Validators.required, Validators.maxLength(50)]],
            address: [null, [Validators.maxLength(250)]],
            father: [null, [Validators.maxLength(250)]],
            mother: [null, [Validators.maxLength(250)]],
            gender: [null, [Validators.required]],
            class: [null, [Validators.required]],
        });
        this.emailForm = this.formBuilder.group({
            subject: [null, [Validators.required]],
            headlines: [null, [Validators.required]],
            bodyImage: [null],
            email_body: ['', [Validators.required]],
            attachment_file: [null]
        });
        this.notificationForm = this.formBuilder.group({
            title: [null, [Validators.required]],
            body: [null, [Validators.required]],
            notificationImage: [null]
        });
        this.getList();
        this.getClassList();
    }
    ngOnDestroy(): void {
        this.editor.destroy();
    } 

    get f() {
        return this.entryForm.controls;
    }

    get e() {
        return this.emailForm.controls;
    }
    get n() {
        return this.notificationForm.controls;
    }

    getClassList() {
        this._service.get('bslc-class').subscribe(res => {
            this.classList = res;
        }, err => { }
        );
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }


    getList() {
        this.loadingIndicator = true;
        this._service.get('student/getAllWithPagination/' + this.page.size + '/' + (this.page.pageNumber + 1)).subscribe(res => {
            // if (!res.status) {
            //     this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
            //     return;
            // }
            this.studentList = res.records;
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

    getFilterList() {
        if(this.search.trim()){
            setTimeout(() => {
                this.loadingIndicator = true;
                this._service.get('searchStudentForModerator/' + this.page.size + '/' + (this.page.pageNumber + 1) + '/' + this.search.trim()).subscribe(res => {
                    this.studentList = res.records;
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
            }, 1000);
        }else{
            this.getList();
        }
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }


        const obj = {
            Id: this.entryForm.value.id,
            email: this.entryForm.value.email.trim(),
            mobile_no: this.entryForm.value.phone.trim(),
            name: this.entryForm.value.name.trim(),
            father_name: this.entryForm.value.father ? this.entryForm.value.father.trim() : null,
            mother_name: this.entryForm.value.mother ? this.entryForm.value.mother.trim() : null,
            address: this.entryForm.value.address ? this.entryForm.value.address.trim() : null,
            gender: this.entryForm.value.gender,
            class_id: this.entryForm.value.class
        };

        this.blockUI.start('Saving data...');
        this._service.post('student/createStudent', obj).subscribe(
            res => {
                this.blockUI.stop();
                if (res.status != 'Ok') {
                    this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                    return;
                }

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
        this.modalTitle = 'Add Student';
        this.saveButtonText = 'Save';
    }

    hideEmailModal() {
        this.emailForm.reset();
        this.modalRef.hide();
        this.submitted = false;
    }

    hideNotificationModal() {
        this.notificationForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        //  this.editor.destroy();
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    openEmailModal(template: TemplateRef<any>) {
        // this.editor = new Editor();
        this.emailForm.controls['email_body'].setValue('');
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    openNotificationModal(template: TemplateRef<any>) {
        // this.editor = new Editor();
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    getItem(id, template: TemplateRef<any>) {
        this.blockUI.start('Saving...');
        this._service.get('student/createStudent' + id).subscribe(res => {
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

    checkstudentInSelectedList(studentId) {
        return this.selectedStudentIds.includes(studentId);
    }

    selectUnselectStudent(student) {
        if (this.selectedStudentIds.includes(student.id)) {
            this.selectedStudentIds.splice(
                this.selectedStudentIds.indexOf(student.id),
                1
            );
            this.selectedStudentsList.splice(
                this.selectedStudentIds.indexOf(student.id),
                1
            );
        } else {
            this.selectedStudentIds.push(student.id);
            this.selectedStudentsList.push(student);
        }
    }

    checkUncheckAll() {
        if (this.selectedStudentIds.length < this.studentList.length) {
            this.selectedStudentIds = [];
            this.studentList.forEach((student) => {
                this.selectedStudentIds.push(student.id);
                this.selectedStudentsList.push(student);
            });
        } else {
            this.selectedStudentIds = [];
            this.selectedStudentsList = [];
        }
    }

   

    sendNotification() {
        this.submitted = true;
        if (this.notificationForm.invalid) {
            return;
        }

        if (this.selectedStudentIds.length == 0) {
            this.toastr.error("No Student Selected", 'Error!', { closeButton: true, disableTimeOut: true });
            return;
        }

        this.blockUI.start('Sending...');
        let formData = new FormData();

        let data = {
            ids: this.selectedStudentIds,
            title: this.notificationForm.value.title.trim(),
            message: this.notificationForm.value.body.trim()
        };

        if (this.notificationImage) {
            formData.append("thumbnail", this.notificationImage)
        }
        
        formData.append("data", JSON.stringify(data));
        const request = this._service.post('send-students-message', formData);
        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.status == 'Ok') {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.hideNotificationModal();
                    this.getList();
                    this.clearData();
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

    clearData() {
        this.selectedStudentIds = [];
        this.selectedStudentsList = [];
    }

    handleAttachmentUpload(e) {
        if (e.target.files && e.target.files.length) {
            this.attachmentfiles = e.target.files;
        }
        //console.log(this.attachmentfiles)
    }

    handleBodyImageUpload(e) {
        if (e.target.files && e.target.files.length) {
            this.bodyImage = e.target.files[0];
        }
      //  console.log(this.bodyImage)
    }

    handleNotificationImageUpload(e) {
        if (e.target.files && e.target.files.length) {
            this.notificationImage = e.target.files[0];
        }
    }
}
