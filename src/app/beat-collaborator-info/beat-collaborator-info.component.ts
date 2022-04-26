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
import { BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-beat-collaborator-info',
    templateUrl: './beat-collaborator-info.component.html',
    styleUrls: ['./beat-collaborator-info.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class  SEWCollaboratorInfoComponent implements OnInit {
    currentUser: any = null;
    entryForm: FormGroup;
    editForm: FormGroup;
    passwordForm: FormGroup;
    submitted = false;
    edit_submitted = false;
    password_submitted = false;
    modalTitle = 'Add Student';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalConfigLg: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;
    promo_id = null;

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];

    genderList = [
        {
            id: 'Male',
            name: 'Male'
        },
        {
            id: 'Female',
            name: 'Female'
        }
    ]

    page = new Page();

    paymentList = [];
    roleList = [];

    promoList = [];
    collaboratorList = [];

    bsConfig: Partial<BsDaterangepickerConfig>;
    bsConfigWritten: Partial<BsDaterangepickerConfig>;
    bsValue: Date[] = [];

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private authService: AuthenticationService,
        private toastr: ToastrService
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;

        this.authService.currentUserDetails.subscribe((value) => {
            this.currentUser = value;
        });
    }


    ngOnInit() {

        //"user_id", "name", "email", "mobile_no", "company_contact_person", "address", "raw_password",

        this.entryForm = this.formBuilder.group({
            id: [null],
            name: [null, [Validators.required, Validators.maxLength(50)]],
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            mobile_no: [null, [Validators.required, Validators.maxLength(50)]],
            company_contact_person: [null, [Validators.required, Validators.maxLength(250)]],
            address: [null, [Validators.required, Validators.maxLength(250)]],
            raw_password: [null, [Validators.required, Validators.minLength(6)]],
            ConfirmPassword: [null, [Validators.required, Validators.minLength(6)]],
            created_by: [this.currentUser.id]
        }, {
            validator: MustMatch('raw_password', 'ConfirmPassword')
        });

        this.editForm = this.formBuilder.group({
            id: [null],
            name: [null, [Validators.required, Validators.maxLength(50)]],
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            mobile_no: [null, [Validators.required, Validators.maxLength(50)]],
            company_contact_person: [null, [Validators.required, Validators.maxLength(250)]],
            address: [null, [Validators.required, Validators.maxLength(250)]],
        });

        this.passwordForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            password: [null, [Validators.required, Validators.minLength(8)]],
            ConfirmPassword: [null, [Validators.required, Validators.minLength(8)]],
        }, {
            validator: MustMatch('raw_password', 'ConfirmPassword')
        });

        this.bsValue = null;
        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            adaptivePosition: true,
            rangeInputFormat: 'DD MMM YYYY',
            maxDate: new Date()
        });

        // this.getList();
        this.getCollaboratorList();
    }

    get f() {
        return this.entryForm.controls;
    }

    get ef() {
        return this.editForm.controls;
    }

    get pcf() {
        return this.passwordForm.controls;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    getCollaboratorList() {
        this._service.get('admin/getCollaboratorList').subscribe(res => {
            this.collaboratorList = res.result;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        });
    }

    getPromoList() {
        this._service.get('admin/beat/promo-list').subscribe(res => {
            this.promoList = res.result;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        });
    }

    onPromoChange(promo){
        this.blockUI.start('Getting data...');
        if(promo){
            let params = {
                fromDate: this.bsValue ? moment(this.bsValue[0]).format("DD-MMM-YYYY") : null,
                toDate: this.bsValue ? moment(this.bsValue[1]).format("DD-MMM-YYYY") : null,
                promo_id: promo.id
            }

            this._service.get('admin/beat/transaction/list-with-promo', params).subscribe(res => {
                this.blockUI.stop();
                this.paymentList = res;
            }, err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            });
        }else{
            this.blockUI.stop();
            this.paymentList = [];
        }
    }

    //saveOrUpdateCollaborator

    public export() {
        this.blockUI.start('Generating data...');

        this._service.get('admin/getCollaboratorList').subscribe(res => {
            if (res.result.length > 0) {
                let readyToExport = []
                res.result.forEach(element => {
                    readyToExport.push({
                        name: element.name,
                        mobile: element.mobile_no,
                        email: element.email,
                        contact_person: element.company_contact_person,
                        address: element.address,
                        is_active: element.is_active ? "Yes" : "No",
                        created_at: element.created_at,
                    })
                });

                const workBook = XLSX.utils.book_new(); // create a new blank book
                const workSheet = XLSX.utils.json_to_sheet(readyToExport);

                XLSX.utils.book_append_sheet(workBook, workSheet, 'Collaborator List'); // add the worksheet to the book
                XLSX.writeFile(workBook, 'Collaborator List.xlsx'); // initiate a file download in browser

            }
            this.blockUI.stop();

        }, err => {
            this.blockUI.stop();
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        }
        );
    }

    resetFilter(){
        this.promo_id = null;
        this.paymentList = [];
    }

    onDateValueChange(e) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.bsValue = e;
        this.getList();
    }

    allClear() {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.bsValue = null;
        this.getList();
    }

    getList() {
        let params = {
            fromDate: this.bsValue ? moment(this.bsValue[0]).format("DD-MMM-YYYY") : null,
            toDate: this.bsValue ? moment(this.bsValue[1]).format("DD-MMM-YYYY") : null,
        }

        this.loadingIndicator = true;
        this._service.get('admin/beat/payment-list', params).subscribe(res => {
            this.paymentList = res;
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

    onCollaboratorSubmit(){
        this.submitted = true;
        console.log(this.entryForm.value)
        console.log(this.entryForm.invalid)
        if (this.entryForm.invalid) {
            return;
        }
        
        delete this.entryForm.value.ConfirmPassword;

        let params = {
            name: this.entryForm.value.name,
            email: this.entryForm.value.email,
            mobile_no: this.entryForm.value.mobile_no,
            company_contact_person: this.entryForm.value.company_contact_person,
            address: this.entryForm.value.address,
            raw_password: this.entryForm.value.raw_password,
            created_by: this.currentUser.id,
        }

        this.blockUI.start('Saving data...');
        this._service.post('admin/saveOrUpdateCollaborator', params).subscribe(
            res => {
                if(res.status == "NotOk"){
                    this.toastr.warning(res.message, 'Success!', { timeOut: 2000 });
                    return;
                }
                this.blockUI.stop();
                this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                this.modalHide();
                this.getCollaboratorList();
            },
            error => {
                this.blockUI.stop();
            }
        );
    }

    onUpdateCollaboratorSubmit(){
        this.edit_submitted = true;
        this.editForm.controls['email'].enable();

        if (this.editForm.invalid) {
            return;
        }
        
        delete this.editForm.value.ConfirmPassword;

        let params = {
            id: this.editForm.value.id,
            name: this.editForm.value.name,
            mobile_no: this.editForm.value.mobile_no,
            company_contact_person: this.editForm.value.company_contact_person,
            address: this.editForm.value.address
        }

        this.blockUI.start('Saving data...');
        this._service.post('admin/saveOrUpdateCollaborator', params).subscribe(
            res => {
                if(res.status == "NotOk"){
                    this.toastr.warning(res.message, 'Success!', { timeOut: 2000 });
                    return;
                }
                this.blockUI.stop();
                this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                this.modalHide();
                this.getCollaboratorList();
            },
            error => {
                this.blockUI.stop();
            }
        );
    }

    onUpdateCollaborator(collaborator, template: TemplateRef<any>)
    {
        this.editForm.controls['id'].setValue(collaborator.id);
        this.editForm.controls['name'].setValue(collaborator.name);
        this.editForm.controls['email'].setValue(collaborator.email);
        this.editForm.controls['mobile_no'].setValue(collaborator.mobile_no);
        this.editForm.controls['company_contact_person'].setValue(collaborator.company_contact_person);
        this.editForm.controls['address'].setValue(collaborator.address);

        this.editForm.controls['email'].disable();

        this.modalTitle = 'Update Collaborator';
        this.saveButtonText = 'Update';
        this.modalRef = this.modalService.show(template, this.modalConfigLg);
    }

    modalHide() {
        this.entryForm.reset();
        this.passwordForm.reset();
        this.modalRef.hide();
        this.isUpdate = false;
        this.submitted = false;
        this.modalTitle = 'Add Member';
        this.saveButtonText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add Collaborator';
        this.saveButtonText = 'Save';
        this.modalRef = this.modalService.show(template, this.modalConfigLg);
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
