import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
    selector: 'app-tenant-masters',
    templateUrl: './tenant-masters.component.html',
    encapsulation: ViewEncapsulation.None
})

export class TenantMasterListComponent implements OnInit {
    currentUser: any = null;
    entryForm: FormGroup;
    uploadForm: FormGroup;
    featureHistoryList: FormArray;
    featureFormArray: any;

    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = 'Add New Room';
    btnSaveText = 'Save';

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    rows = [];
    propertyDLList: Array<any> = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;

    urls = [];
    files = [];

    scrollBarHorizontal = (window.innerWidth < 1200);
    baseUrl = environment.baseUrl;
    @ViewChild('dataTable') table: any;

    arrayBuffer: any;
    itemFile: File;
    itemUploadList: Array<any> = [];

    packagePrice = 0;

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private _authService: AuthenticationService,
        private toastr: ToastrService,
        private router: Router
    ) {
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };
        this._authService.currentUserDetails.subscribe((value) => {
            this.currentUser = value;
        });
    }


    ngOnInit() {

        this.entryForm = this.formBuilder.group({
            id: [null],
            company_name: [null, [Validators.required]],
            company_name_jp: [null, [Validators.maxLength(550)]],
            email: [null, [Validators.required]],
            address: [null, [Validators.required]],
            type_of_industry: [null, [Validators.required]],
            number_of_employee: [0, [Validators.required]],
            representative_name: [null, [Validators.required]],
            establishment_date: [null, [Validators.required]],
            market_capitalization: [0, [Validators.required]],
            revenue: [0, [Validators.required]],
            profile_image: [null],
            is_active: [true]
        });

        this.uploadForm = this.formBuilder.group({
            feature_thumbnail: ['']
        });
        //this.getPropertyList();
        this.getList();
    }

    get f() {
        return this.entryForm.controls;
    }

    onSelectFile(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.uploadForm.get('feature_thumbnail').setValue(this.files);
            }
        }
    }

    getPropertyList() {
        this._service.get('property-dropdown-list').subscribe(res => {
            if (!res.success) {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.propertyDLList = res.data;
        }, err => { }
        );
    }

    getList() {
        this.loadingIndicator = true;

        this._service.get('tenant-list').subscribe(res => {
            if (!res.success) {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.rows = res.data;
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }
        );
    }

    getItem(item, template: TemplateRef<any>) 
    {
        this.modalTitle = 'Update Tenant';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['company_name'].setValue(item.company_name);
        this.entryForm.controls['company_name_jp'].setValue(item.company_name_jp);
        this.entryForm.controls['email'].setValue(item.email);
        this.entryForm.controls['address'].setValue(item.address);
        this.entryForm.controls['type_of_industry'].setValue(item.type_of_industry);
        this.entryForm.controls['number_of_employee'].setValue(item.number_of_employee);
        this.entryForm.controls['representative_name'].setValue(item.representative_name);
        this.entryForm.controls['establishment_date'].setValue(item.establishment_date);
        this.entryForm.controls['market_capitalization'].setValue(item.market_capitalization);
        this.entryForm.controls['revenue'].setValue(item.revenue);
        this.entryForm.controls['is_active'].setValue(item.is_active);

        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        const formData = new FormData();
        if(this.uploadForm.get('feature_thumbnail').value){
            formData.append('file', this.uploadForm.get('feature_thumbnail').value);
        }
        
        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        const params = {
            id: this.entryForm.value.id ? this.entryForm.value.id : null,
            company_name: this.entryForm.value.company_name.trim(),
            company_name_jp: this.entryForm.value.company_name_jp ? this.entryForm.value.company_name_jp.trim() : null,
            email: this.entryForm.value.email,
            address: this.entryForm.value.address,
            type_of_industry: this.entryForm.value.type_of_industry,
            number_of_employee: this.entryForm.value.number_of_employee,
            representative_name: this.entryForm.value.representative_name,
            establishment_date: this.entryForm.value.establishment_date ? this.entryForm.value.establishment_date : null,
            market_capitalization: this.entryForm.value.market_capitalization,
            revenue: this.entryForm.value.revenue,
            is_active: this.entryForm.value.is_active
        };

        formData.append('data', JSON.stringify(params));

        this._service.post('save-update-tenant', formData).subscribe(
            data => {
                this.blockUI.stop();
                if (data.success) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getList();
                } else {
                    this.toastr.error(data.message, 'Error!', { timeOut: 2000 });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
            }
        );
    }

    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Add New Tenant';
        this.btnSaveText = 'Save';
        this.packagePrice = 0;
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add New Tenant';
        this.btnSaveText = 'Save';
        this.entryForm.controls['is_active'].setValue(true);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    getDateTimeFormat(value: Date) {
        return moment(value).format('DD-MMM-YYYY hh:mm A');
    }

    getDateFormatModal(value: Date) {
        return moment(value).format('yyyy-MM-DDTHH:mm:ss');
    }

    getOnlyDateFormatModal(value: Date) {
        return moment(value).format('yyyy-MM-DD');
    }

    validateMinDateFormat(value: Date) {
        return moment(value).format('YYYY-MM-DD');
    }

    validateDateTimeFormat(value: Date) {
        return moment(value).format('YYYY-MM-DD hh:mm A');
    }
}
