import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { AuthenticationService } from '../_services/authentication.service';
import { MustMatch } from '../_helpers/must-match.validator';
import * as moment from 'moment';

@Component({
    selector: 'app-recruitment-exams',
    templateUrl: './recruitment-exams.component.html',
    styleUrls: ['./recruitment-exams.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class  RecruitmentExamsComponent implements OnInit {

    entryForm: FormGroup;
    passwordForm: FormGroup;
    uploadForm: FormGroup;
    submitted = false;
    password_submitted = false;
    modalTitle = 'Add New Recruitment Exams';
    isUpdate = false;
    saveButtonText: string = 'Save';
    btnSaveText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];

    typeList = [{id:'Guardian',name:'Guardian'},{id:'Student',name:'Student'},{id:'Tutor',name:'Tutor'}];

    page = new Page();

    minDate;

    examList = [];
    promotionList = [];
    roleList = [];

    promo_file;

    urls = [];
    files = [];

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private confirmService: ConfirmService,
        private authService: AuthenticationService,
        private toastr: ToastrService
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.minDate = this.getDateTimeFormat(new Date());
    }

    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            session_name: [null, [Validators.required, Validators.maxLength(250)]],
            exam_name: [null, [Validators.required, Validators.maxLength(250)]],
            exam_name_bn: [null, [Validators.required, Validators.maxLength(250)]],
            exam_code: [null, [Validators.maxLength(250)]],
            duration: [null, [Validators.required, Validators.maxLength(250)]],
            positive_mark: [1, [Validators.required, Validators.maxLength(250)]],
            negative_mark: [0, [Validators.required, Validators.maxLength(250)]],
            total_mark: [null, [Validators.required, Validators.maxLength(250)]],
            question_number: [null, [Validators.required, Validators.maxLength(250)]],
            appeared_from: [null, [Validators.required, Validators.maxLength(250)]],
            appeared_to: [null, [Validators.required, Validators.maxLength(250)]],
            is_active: [true],
        });

        this.passwordForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            password: [null, [Validators.required, Validators.minLength(8)]],
            ConfirmPassword: [null, [Validators.required, Validators.minLength(8)]],
        }, {
            validator: MustMatch('password', 'ConfirmPassword')
        });

        this.uploadForm = this.formBuilder.group({
            profile: ['']
        });

        this.getList();
        //this.getRoleList();
    }

    get f() {
        return this.entryForm.controls;
    }

    get pcf() {
        return this.passwordForm.controls;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    getList() {
        this.loadingIndicator = true;
        this._service.get('admin/allRecruitExamList').subscribe(res => {
            this.examList = res.data;
            //console.log(this.examList);
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

    editExam(item, template: TemplateRef<any>){
        this.modalTitle = 'Update Exam';
        this.btnSaveText = 'Update';
        
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['session_name'].setValue(item.session_name);
        this.entryForm.controls['exam_name'].setValue(item.exam_name);
        this.entryForm.controls['exam_name_bn'].setValue(item.exam_name_bn);
        this.entryForm.controls['exam_code'].setValue(item.exam_code);
        this.entryForm.controls['duration'].setValue(item.duration);
        this.entryForm.controls['positive_mark'].setValue(item.positive_mark);
        this.entryForm.controls['negative_mark'].setValue(item.negative_mark);
        this.entryForm.controls['total_mark'].setValue(item.total_mark);
        this.entryForm.controls['question_number'].setValue(item.question_number);
        this.entryForm.controls['is_active'].setValue(item.is_active);
        this.entryForm.controls['appeared_from'].setValue(this.getDateFormatModal(item.appeared_from));
        this.entryForm.controls['appeared_to'].setValue(this.getDateFormatModal(item.appeared_to));
        this.openEditModal(template);
    }

    deleteExam(exam){
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Deleting...');
                        this._service.post('admin/deleteRecruitExam', { id : exam.id }).subscribe(
                            data => {
                                if(data.status){
                                    this.blockUI.stop();
                                    this.toastr.success(data.message, 'Success', { timeOut: 4000 });
                                    this.getList();
                                }else{
                                    this.blockUI.stop();
                                    this.toastr.error(data.message, 'Attention!', { timeOut: 4000 });
                                }
                            },
                            err => {
                                this.blockUI.stop();
                                this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                            }
                        );
                    }
                }
            );
    }

    getRoleList() {
        this.loadingIndicator = true;
        this._service.get('role').subscribe(res => {
            this.roleList = res;
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


    onSelectUpoladFile(event) {
        this.uploadForm.reset();
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                this.entryForm.controls['file'].setValue(null);
                this.uploadForm.reset()
                return;
            }else{
                this.uploadForm.get('profile').setValue(this.files);
                console.log(this.uploadForm.value.profile)
                //this.submitImage();
            }
        }
    }

    submitPromo(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        if(!this.uploadForm.get('profile').value){
            this.toastr.warning('Please, select file', 'Attention!', { timeOut: 3000 });
        }

        let formData = new FormData();        
        if(this.uploadForm.get('profile').value){
            formData.append("file", this.uploadForm.get('profile').value);
        }
        delete this.entryForm.value.file;

        formData.append("data", JSON.stringify(this.entryForm.value));

        this.blockUI.start('Saving data...');
        this._service.post('promotion', formData).subscribe(
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

        this.blockUI.start('Saving data. Please wait...');
        const obj = {
            id: this.entryForm.value.id,
            session_name: this.entryForm.value.session_name,
            exam_name: this.entryForm.value.exam_name,
            exam_name_bn: this.entryForm.value.exam_name_bn,
            exam_code: this.entryForm.value.exam_code,
            duration: this.entryForm.value.duration,
            positive_mark: this.entryForm.value.positive_mark,
            negative_mark: this.entryForm.value.negative_mark,
            total_mark: this.entryForm.value.total_mark,
            question_number: this.entryForm.value.question_number,
            is_active: this.entryForm.value.is_active ? true : false,
            appeared_from: this.validateDateTimeFormat(this.entryForm.value.appeared_from),
            appeared_to: this.validateDateTimeFormat(this.entryForm.value.appeared_to)
        };

        this._service.post('admin/create-update-recruitment-exam', obj).subscribe(
            data => {
                this.blockUI.stop();
                if(data.status){
                    this.toastr.success(data.message, 'Success', { timeOut: 2000 });
                    this.modalHide();
                    this.getList();
                }else{
                    this.toastr.warning(data.message, 'Warning', { timeOut: 2000 });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }


    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.isUpdate = false;
        this.submitted = false;
        this.modalTitle = 'Add New Exam';
        this.saveButtonText = 'Save';
        this.btnSaveText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add New Exam';
        this.saveButtonText = 'Save';
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    openEditModal(template: TemplateRef<any>) {
        this.modalTitle = 'Update Exam';
        this.saveButtonText = 'Update';
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    openPasswordModal(member, template: TemplateRef<any>) {
        this.modalTitle = 'Update Password ('+member.name+')';
        this.saveButtonText = 'Update';
        this.passwordForm.controls['email'].setValue(member.email);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    onUpdatePasswordFormSubmit() {
        this.password_submitted = true;
        if (this.passwordForm.invalid) {
            return;
        }
        
        delete this.passwordForm.value.ConfirmPassword;

        this.blockUI.start('Updating Password...');
        this._service.post('update-password', this.passwordForm.value).subscribe(
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

    getItem(id, template: TemplateRef<any>) {
        this.blockUI.start('Saving...');
        this._service.get('Account/GetUserById/' + id).subscribe(res => {
            this.blockUI.stop();
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.entryForm.controls['id'].setValue(res.Record.Id);
            this.entryForm.controls['FirstName'].setValue(res.Record.FirstName);
            this.entryForm.controls['LastName'].setValue(res.Record.LastName);
            this.entryForm.controls['Email'].setValue(res.Record.Email);
            this.entryForm.controls['IsActive'].setValue(res.Record.IsActive);
            this.entryForm.controls['Password'].setValue('********');
            this.entryForm.controls['ConfirmPassword'].setValue('********');

            this.modalTitle = 'Update Member';
            this.saveButtonText = 'Update';
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
            this.blockUI.stop();
        }
        );
    }

    getDateTimeFormat(value: Date) {
        return moment(value).format('DD-MMM-YYYY hh:mm A');
    }

    getDateFormatModal(value: Date) {
        return moment(value).format('yyyy-MM-DDTHH:mm:ss');
    }

    validateMinDateFormat(value: Date) {
        return moment(value).format('YYYY-MM-DD');
    }

    validateDateTimeFormat(value: Date) {
        return moment(value).format('YYYY-MM-DD hh:mm A');
    }
}
