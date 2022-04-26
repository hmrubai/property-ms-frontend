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
    selector: 'app-beat-promo-list',
    templateUrl: './beat-promo-list.component.html',
    styleUrls: ['./beat-promo-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class  BEATPromoListComponent implements OnInit {
    currentUser: any = null;
    entryForm: FormGroup;
    passwordForm: FormGroup;
    submitted = false;
    password_submitted = false;
    modalTitle = 'Add Student';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
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
    packageList = [];

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

        //"promo_code", "promo_value", "beat_package_id", "collaborator_id", "limit", "expiry_date", "is_active", "created_by"
        this.entryForm = this.formBuilder.group({
            id: [null],
            promo_code: [null, [Validators.required, Validators.maxLength(50)]],
            promo_value: [0, [Validators.required, Validators.maxLength(50)]],
            beat_package_id: [null, [Validators.required]],
            collaborator_id: [null, [Validators.required]],
            limit: [0],
            expiry_date: [null],
            is_active: [true],
            created_by: [this.currentUser.id],
        });

        this.passwordForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            password: [null, [Validators.required, Validators.minLength(8)]],
            ConfirmPassword: [null, [Validators.required, Validators.minLength(8)]],
        }, {
            validator: MustMatch('password', 'ConfirmPassword')
        });

        this.bsValue = null;
        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            adaptivePosition: true,
            rangeInputFormat: 'DD MMM YYYY',
            maxDate: new Date()
        });

        this.getPackageList();
        this.getPromoList();
        this.getCollaboratorList();
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

    getPromoList() {
        this.blockUI.start('Getting data...');
        this._service.get('admin/beat/promo-list').subscribe(res => {
            this.promoList = res.result;
            this.blockUI.stop();
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            this.blockUI.stop();
        });
    }

    getCollaboratorList() {
        this._service.get('admin/getCollaboratorList').subscribe(res => {
            this.collaboratorList = res.result;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        });
    }

    getPackageList() {
        this._service.get('beat/package/dropdown-list').subscribe(res => {
            this.packageList = res.result;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        });
    }

    openEditModal(promo, template: TemplateRef<any>) {
        this.modalTitle = 'Update Promo';
        this.saveButtonText = 'Update';

        this.entryForm.controls['id'].setValue(promo.id);
        this.entryForm.controls['promo_code'].setValue(promo.promo_code);
        this.entryForm.controls['promo_value'].setValue(promo.promo_value);
        this.entryForm.controls['beat_package_id'].setValue(promo.beat_package_id);
        this.entryForm.controls['collaborator_id'].setValue(promo.collaborator_id);
        this.entryForm.controls['limit'].setValue(promo.limit ? promo.limit : 0);
        this.entryForm.controls['is_active'].setValue(promo.is_active);
        this.entryForm.controls['created_by'].setValue(this.currentUser.id);

        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving data...');
        this._service.post('admin/beat/add-update-promo', this.entryForm.value).subscribe(
            res => {
                this.blockUI.stop();
                if(res.status == "NotOk"){
                    this.toastr.warning(res.message, 'Attention!', { timeOut: 2000 }); 
                    return;
                }
                
                this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                this.modalHide();
                this.getPromoList();
            },
            error => {
                this.blockUI.stop();
            }
        );
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
        this.entryForm.controls['created_by'].setValue(this.currentUser.id);
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

    public export() {
        this.blockUI.start('Generating data...');

        this._service.get('admin/beat/promo-list').subscribe(res => {
            if (res.result.length > 0) {
                let readyToExport = []
                res.result.forEach(element => {
                    readyToExport.push({
                        promo_code: element.promo_code,
                        promo_amount: element.promo_value,
                        package_name: element.package_name,
                        package_price: element.package_price,
                        company_name: element.company_name,
                        company_email: element.email,
                        company_mobile_no: element.mobile_no,
                        company_address: element.address,
                        is_active: element.is_active ? "Yes" : "No",
                        created_at: element.created_at,
                    })
                });

                const workBook = XLSX.utils.book_new(); // create a new blank book
                const workSheet = XLSX.utils.json_to_sheet(readyToExport);

                XLSX.utils.book_append_sheet(workBook, workSheet, 'Promo List'); // add the worksheet to the book
                XLSX.writeFile(workBook, 'Promo List.xlsx'); // initiate a file download in browser

            }
            this.blockUI.stop();

        }, err => {
            this.blockUI.stop();
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        }
        );
    }

    modalHide() {
        this.entryForm.reset();
        this.passwordForm.reset();
        this.modalRef.hide();
        this.isUpdate = false;
        this.submitted = false;
        this.entryForm.controls['created_by'].setValue(this.currentUser.id);
        this.modalTitle = 'Add Member';
        this.saveButtonText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add New Promo Code';
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