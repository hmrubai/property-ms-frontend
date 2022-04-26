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

// import * as moment from 'moment';

@Component({
    selector: 'app-class',
    templateUrl: './student-institute.component.html',
    styleUrls: ['./student-institute.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class  studentInstituteComponent implements OnInit {

    entryForm: FormGroup;
    passwordForm: FormGroup;
    uploadForm: FormGroup;
    submitted = false;
    password_submitted = false;
    modalTitle = 'Add New course';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalRef: BsModalRef;

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];

    typeList = [{id:'Guardian',name:'Guardian'},{id:'Student',name:'Student'},{id:'Tutor',name:'Tutor'}];

    page = new Page();

    studentInstitutes = [];
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
    }

    ngOnInit() {

        this.entryForm = this.formBuilder.group({
            id: [null,],
            keywords: [null,],
            name: [null, [Validators.required]],
            name_bn: [null, [Validators.required]],
            status: ['Active'],
            institute_type: ['SSC']
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
        this._service.get('student-institute').subscribe(res => {
            this.studentInstitutes = res.data;
            this.entryForm.controls['sequence'].setValue(res.length + 1);
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

    deletePromo(promo){
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Deleting...');
                        this._service.delete('promotion/'+ promo.id).subscribe(res => {
                            //console.log(res)
                            this.toastr.success('Successfully deleted!', 'Successful!');
                            this.getList();
                            this.blockUI.stop();
                        }, err => {
                            this.blockUI.stop();
                            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
                        });
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

    submitInstituteCreate(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }
        if(this.entryForm.value.id){ // update api
            
            this.blockUI.start('Updating data...');
            this._service.post('student-institute/'+this.entryForm.value.id, this.entryForm.value).subscribe(
                res => {
                    this.blockUI.stop();
                    this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getList();
                },
                error => {
                    //this.toastr.warning(error.message, 'Error!', { timeOut: 2000 });
                    this.blockUI.stop();
                }
            );
        }else{ // create api
            
            this.blockUI.start('Saving data...');
            this._service.post('student-institute', this.entryForm.value).subscribe(
                res => {
                    this.blockUI.stop();
                    this.toastr.success(res.message, 'Success!', { timeOut: 3000 });
                    this.modalHide();
                    this.getList();
                },
                error => {
                    //this.toastr.warning(error.message, 'Error!', { timeOut: 3000 });
                    this.blockUI.stop();
                }
            );
        }
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }
        
        delete this.entryForm.value.ConfirmPassword;

        this.blockUI.start('Saving data...');
        this._service.post('createMember', this.entryForm.value).subscribe(
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
        this.modalTitle = 'Add New Class';
        this.saveButtonText = 'Save';
    }

    openInstituteUpdateModal(institute,template: TemplateRef<any>) {

        this.entryForm.controls['id'].setValue(institute.id);
        this.entryForm.controls['name'].setValue(institute.name);
        this.entryForm.controls['name_bn'].setValue(institute.name_bn);
        this.entryForm.controls['keywords'].setValue(institute.keywords);
        this.entryForm.controls['institute_type'].setValue(institute.institute_type);
        this.entryForm.controls['status'].setValue(institute.status);

        this.modalTitle = 'Update Student Institute';
        this.saveButtonText = 'Update';
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add Institute';
        this.saveButtonText = 'Save';
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

            this.modalTitle = 'Update Member';
            this.saveButtonText = 'Update';
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
            this.blockUI.stop();
        }
        );
    }
}
