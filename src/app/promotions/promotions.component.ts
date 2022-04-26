import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
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
    selector: 'app-promotions',
    templateUrl: './promotions.component.html',
    styleUrls: ['./promotions.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class  PromotionComponent implements OnInit {

    entryForm: FormGroup;
    passwordForm: FormGroup;
    uploadForm: FormGroup;
    submitted = false;
    password_submitted = false;
    modalTitle = 'Add New Promotion';
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
    }

    ngOnInit() {

        this.entryForm = this.formBuilder.group({
            id: [null,],
            title: [null, [Validators.required]],
            navigate_to_web_url: [null,],
            navigate_to_app_location: [null,],
            data: [null,],
            type: [null, [Validators.required]],
            should_cache: [true],
            file: [null],
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
        this._service.get('promotions').subscribe(res => {
            this.promotionList = res;
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
        //'promotion/'+ id
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


    // let formData = new FormData();        
    // if(this.files.length > 0){
    // formData.append("file", this.files[0]);
    // }
    
    // let data = {
    // id:null,
    // title: this.promo.title,
    // navigate_to_web_url: this.promo.navigate_to_web_url ? this.promo.navigate_to_web_url : null,
    // navigate_to_app_location: this.promo.navigate_to_app_location ? this.promo.navigate_to_app_location :null,
    // data: this.promo.data ? this.promo.data : null,
    // type: this.promo.type.id,
    // should_cache: true,
    // is_active: true
    // }

    // formData.append("data", JSON.stringify(data));



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
            return;
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

    // const formData = new FormData();
    //     // let params = {
    //     //     files: [this.uploadForm.get('profile').value]
    //     // }
    //     formData.append('files[0]', this.uploadForm.get('profile').value);


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
        this.modalTitle = 'Add New Promotion';
        this.saveButtonText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add New Promotion';
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
