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
import { ConditionalExpr } from '@angular/compiler';

// import * as moment from 'moment';

@Component({
    selector: 'app-student-complain-ticket',
    templateUrl: './student-complain-ticket.component.html',
    styleUrls: ['./student-complain-ticket.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class StudentComplainTicketComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    modalTitle = 'Create New Exam';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalRef: BsModalRef;

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];

    page = new Page();

    ticketList = [];

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private confirmService: ConfirmService,
        private authService: AuthenticationService,
        private toastr: ToastrService
    ) {
        this.page.pageNumber = 1;
        this.page.size = 10;
    }


    ngOnInit() 
    {
        this.entryForm = this.formBuilder.group({
            id: [null],
            Email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            Password: [null, [Validators.required, Validators.minLength(6)]],
            ConfirmPassword: [null, [Validators.required, Validators.minLength(6)]],
            FirstName: [null, [Validators.required, Validators.maxLength(50)]],
            LastName: [null, [Validators.required, Validators.maxLength(50)]],
            IsActive: [true, [Validators.required]]
        }, {
            validator: MustMatch('Password', 'ConfirmPassword')
        });
        this.getList();
    }

    get f() {
        return this.entryForm.controls;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }


    checkParcentage(total, value){
        let rest = parseInt(total) - parseInt(value);
        console.log(rest);
    }


    getList() {
        this.loadingIndicator = true;
        this._service.get('get-student-ticket-list').subscribe(res => {
            this.ticketList = res;
            this.page.totalElements = res.length;
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        });
    }

    MarkAsSolved(complain){
        let params = {
            id: complain.id,
        }

        this.confirmService.confirm('Are you sure?', 'Do you want to change the status?')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Updating...');
                        this._service.post('save-student-ticket-as-solved', params).subscribe(res => {
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

    DeleteAllSolved(){
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Deleting...');
                        this._service.get('delete-solved-student-ticket').subscribe(res => {
                            this.toastr.success(res.message, 'Successful!');
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

    secondsToDhms(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        
        var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving data...');
        const obj = {
            Id: this.entryForm.value.id,
            Email: this.entryForm.value.Email.trim(),
            Password: this.entryForm.value.Password.trim(),
            FirstName: this.entryForm.value.FirstName.trim(),
            LastName: this.entryForm.value.LastName.trim(),
            IsActive: this.entryForm.value.IsActive
        };

        this._service.post('Account/CreateOrUpdateUser', obj).subscribe(
            res => {
                this.blockUI.stop();
                if (!res.Success) {
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

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    goToItemDetails(row){
        console.log(row);
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
