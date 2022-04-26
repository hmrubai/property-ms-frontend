import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './../_services/authentication.service';
import { MustMatch } from './../_helpers/must-match.validator';
import { Location } from '@angular/common';

@Component({
    selector: 'app-assesment-result',
    templateUrl: './assesment-result.component.html',
    styleUrls: ['./assesment-result.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AssesmentResultComponent implements OnInit {

    isCollapsed = false;
    is_loaded = false;
    entryForm: FormGroup;
    submitted = false;
    modalTitle = 'Add Student';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;

    assesmentId;

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalRef: BsModalRef;

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];

    page = new Page();

    projectName = '';
    assesmentResult:any;

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.assesmentId = this.route.snapshot.paramMap.get("id");
    }


    ngOnInit() {

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


    getList() {
        this.loadingIndicator = true;
        this._service.get('project-student-list-by-project-id-with-result/' + this.assesmentId).subscribe(res => {
            this.assesmentResult = res;
            this.projectName = res.name;
            this.is_loaded = true;
            //this.page.totalElements = res.total_number;
            this.loadingIndicator = false;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            this.loadingIndicator = false;
        }
        );
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

    backTo() {
        this.location.back();
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
