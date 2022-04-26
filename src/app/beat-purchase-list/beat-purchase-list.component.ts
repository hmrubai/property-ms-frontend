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

// import * as moment from 'moment';

@Component({
    selector: 'app-beat-purchase-list',
    templateUrl: './beat-purchase-list.component.html',
    styleUrls: ['./beat-purchase-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BEATPurchaseListComponent implements OnInit {

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
    }


    ngOnInit() {

        this.entryForm = this.formBuilder.group({
            name: [null, [Validators.required, Validators.maxLength(50)]],
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            password: [null, [Validators.required, Validators.minLength(6)]],
            ConfirmPassword: [null, [Validators.required, Validators.minLength(6)]],
            gender: [null, [Validators.required, Validators.maxLength(50)]],
            role_id: [null, [Validators.required, Validators.maxLength(50)]],
        }, {
            validator: MustMatch('password', 'ConfirmPassword')
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

        // this.getList();
        // this.getRoleList();
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

    public export() {
        this.blockUI.start('Generating data...');
        let params = {
            fromDate: this.bsValue ? moment(this.bsValue[0]).format("DD-MMM-YYYY") : null,
            toDate: this.bsValue ? moment(this.bsValue[1]).format("DD-MMM-YYYY") : null,
        }

        this._service.get('admin/beat/payment-list-export', params).subscribe(res => {
            if (res.result.length > 0) {
                let readyToExport = []
                res.result.forEach(element => {
                    readyToExport.push({
                        name: element.name,
                        mobile: element.phone,
                        email: element.email,
                        package: element.item_name,
                        package_type: element.item_type,
                        is_coupon_used: element.is_promo_applied ? "Yes" : "No",
                        coupon: element.promo_code ? element.promo_code : '-',
                        coupon_amount: element.promo_value ? element.promo_value : 0,
                        purchase_date: element.created_at,
                    })
                });

                const workBook = XLSX.utils.book_new(); // create a new blank book
                const workSheet = XLSX.utils.json_to_sheet(readyToExport);

                XLSX.utils.book_append_sheet(workBook, workSheet, 'Purchase List'); // add the worksheet to the book
                XLSX.writeFile(workBook, 'Purchase Report.xlsx'); // initiate a file download in browser

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
        this.modalTitle = 'Add Member';
        this.saveButtonText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add Member';
        this.saveButtonText = 'Save';
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    openPasswordModal(member, template: TemplateRef<any>) {
        this.modalTitle = 'Update Password (' + member.name + ')';
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
