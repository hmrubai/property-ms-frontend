import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
    selector: 'app-add-contract-masters',
    templateUrl: './add-contract-masters.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AddContractMasterListComponent implements OnInit {
    currentUser: any = null;
    entryForm: FormGroup;
    uploadForm: FormGroup;
    featureHistoryList: FormArray;
    featureFormArray: any;

    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = 'Add New Room';
    pageTitle = 'Add New Contract';
    btnSaveText = 'Save';
    contractId;

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    rows = [];
    propertyDLList: Array<any> = [];
    roomDLList: Array<any> = [];
    tenantDLList: Array<any> = [];
    contractist: Array<any> = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    contractDetails;
    is_loaded = false;

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
        private router: Router,
        private route: ActivatedRoute,
    ) {
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };
        this._authService.currentUserDetails.subscribe((value) => {
            this.currentUser = value;
        });

        this.contractId = this.route.snapshot.paramMap.get("contract_id");
    }


    ngOnInit() {

        this.entryForm = this.formBuilder.group({
            id: [null],
            property_id: [null, [Validators.required]],
            room_id: [null, [Validators.required]],
            tenant_id: [null, [Validators.required]],
            contract_type: [null, [Validators.required]],
            unit_rent_sm: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            unit_rent_tsubo: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            monthly_rent: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            date_of_rent_occurrence: [null, [Validators.required]],
            initial_month_rent: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            final_month_rent: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            unit_common_fees_sm: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            unit_common_fees_tsubo: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            monthly_common_fees: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            date_of_common_fee_occurrence: ['', [Validators.required, Validators.maxLength(550)]],
            initial_month_common_fee: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            final_month_common_fee: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            unit_of_total_rent_sm: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            unit_of_total_rent_tsubo: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            total_rent: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            total_initial_month_rent: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            total_final_month_rent: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            number_of_deposit_months: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            deposit: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            date_of_contract_start: [null, [Validators.required]],
            date_of_contract_end: [null, [Validators.required]],
            automatic_extention: [false, [Validators.maxLength(550)]],
            month_of_automatic_extention: ['', [Validators.maxLength(550)]],
            period_of_cancel_notice: [null, [Validators.required]],
            date_of_received_application_form_for_moving_in: [null, [Validators.required]],
            date_of_contract_signed: [null, [Validators.required]],
            document_delivery_date: [null],
            date_of_noticing_contract_termination: [null],
            cancellation_date: [null],
            remarks_on_furniture_and_equipment: [null],
            other_remarks: [null],
            is_active: [true]
        });

        if(this.contractId){
            this.entryForm.controls['id'].setValue(this.contractId);
            this.getContractDetails();
        }

        this.uploadForm = this.formBuilder.group({
            feature_thumbnail: ['']
        });
        this.getPropertyList();
        this.getTenantList();
        //this.getList();
    }

    get f() {
        return this.entryForm.controls;
    }

    //establishment_date: this.entryForm.value.establishment_date ? this.validateMinDateFormat(this.entryForm.value.establishment_date) : null,
    //this.entryForm.controls['establishment_date'].setValue(this.getOnlyDateFormatModal(item.establishment_date));

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

    getRoomListByProperty(property) {
        this.blockUI.start('Getting Room List...')
        this._service.get('room-list-by-id/' + property.id).subscribe(res => {
            this.blockUI.stop();
            if (!res.success) {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.roomDLList = res.data;
        }, err => { 
            this.blockUI.stop();
        }
        );
    }

    getContractDetails(){
        this.blockUI.start('Getting Contract Details...')
        this._service.get('contract-details-by-id/' + this.contractId).subscribe(res => {
                this.blockUI.stop();
                if (!res.success) {
                    this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                    return;
                }
                this.contractDetails = res.data;
                this.is_loaded = true;
                this.setEditableData();
            }, err => { 
                this.blockUI.stop();
            }
        );
    }

    setEditableData()
    {
        this.pageTitle = 'Update Contract';
        this.btnSaveText = 'Update';

        this.getRoomListByProperty({id : this.contractDetails.property_id});

        this.entryForm.controls['property_id'].setValue(this.contractDetails.property_id);
        this.entryForm.controls['room_id'].setValue(this.contractDetails.room_id);
        this.entryForm.controls['tenant_id'].setValue(this.contractDetails.tenant_id);
        this.entryForm.controls['contract_type'].setValue(this.contractDetails.contract_type);
        this.entryForm.controls['unit_rent_sm'].setValue(this.contractDetails.unit_rent_sm);
        this.entryForm.controls['unit_rent_tsubo'].setValue(this.contractDetails.unit_rent_tsubo);
        this.entryForm.controls['monthly_rent'].setValue(this.contractDetails.monthly_rent);
        this.entryForm.controls['date_of_rent_occurrence'].setValue(this.getOnlyDateFormatModal(this.contractDetails.date_of_rent_occurrence));
        this.entryForm.controls['initial_month_rent'].setValue(this.contractDetails.initial_month_rent);
        this.entryForm.controls['final_month_rent'].setValue(this.contractDetails.final_month_rent);
        this.entryForm.controls['unit_common_fees_sm'].setValue(this.contractDetails.unit_common_fees_sm);
        this.entryForm.controls['unit_common_fees_tsubo'].setValue(this.contractDetails.unit_common_fees_tsubo);
        this.entryForm.controls['monthly_common_fees'].setValue(this.contractDetails.monthly_common_fees);
        this.entryForm.controls['date_of_common_fee_occurrence'].setValue(this.contractDetails.date_of_common_fee_occurrence);
        this.entryForm.controls['initial_month_common_fee'].setValue(this.contractDetails.initial_month_common_fee);
        this.entryForm.controls['final_month_common_fee'].setValue(this.contractDetails.final_month_common_fee);
        this.entryForm.controls['unit_of_total_rent_sm'].setValue(this.contractDetails.unit_of_total_rent_sm);
        this.entryForm.controls['unit_of_total_rent_tsubo'].setValue(this.contractDetails.unit_of_total_rent_tsubo);
        this.entryForm.controls['total_rent'].setValue(this.contractDetails.total_rent);
        this.entryForm.controls['total_initial_month_rent'].setValue(this.contractDetails.total_initial_month_rent);
        this.entryForm.controls['total_final_month_rent'].setValue(this.contractDetails.total_final_month_rent);
        this.entryForm.controls['number_of_deposit_months'].setValue(this.contractDetails.number_of_deposit_months);
        this.entryForm.controls['deposit'].setValue(this.contractDetails.deposit);
        this.entryForm.controls['date_of_contract_start'].setValue(this.contractDetails.date_of_contract_start);
        this.entryForm.controls['date_of_contract_end'].setValue(this.contractDetails.date_of_contract_end);
        this.entryForm.controls['automatic_extention'].setValue(this.contractDetails.automatic_extention);
        this.entryForm.controls['month_of_automatic_extention'].setValue(this.contractDetails.month_of_automatic_extention);
        this.entryForm.controls['period_of_cancel_notice'].setValue(this.contractDetails.period_of_cancel_notice);
        this.entryForm.controls['date_of_received_application_form_for_moving_in'].setValue(this.contractDetails.date_of_received_application_form_for_moving_in);
        this.entryForm.controls['date_of_contract_signed'].setValue(this.contractDetails.date_of_contract_signed);
        this.entryForm.controls['document_delivery_date'].setValue(this.contractDetails.document_delivery_date);
        this.entryForm.controls['date_of_noticing_contract_termination'].setValue(this.contractDetails.date_of_noticing_contract_termination);
        this.entryForm.controls['cancellation_date'].setValue(this.contractDetails.cancellation_date);
        this.entryForm.controls['remarks_on_furniture_and_equipment'].setValue(this.contractDetails.remarks_on_furniture_and_equipment);
        this.entryForm.controls['other_remarks'].setValue(this.contractDetails.other_remarks);
        this.entryForm.controls['is_active'].setValue(this.contractDetails.is_active);

    }

    getTenantList() {
        this._service.get('tenant-dropdown-list').subscribe(res => {
            if (!res.success) {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.tenantDLList = res.data;
        }, err => { }
        );
    }

    getList() {
        this.loadingIndicator = true;

        this._service.get('contract-list').subscribe(res => {
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

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        const formData = new FormData();
        // if(this.uploadForm.get('feature_thumbnail').value){
        //     formData.append('file', this.uploadForm.get('feature_thumbnail').value);
        // }
        
        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        const params = {
            id: this.entryForm.value.id ? this.entryForm.value.id : null,
            property_id: this.entryForm.value.property_id,
            room_id: this.entryForm.value.room_id,
            tenant_id: this.entryForm.value.tenant_id,
            contract_type: this.entryForm.value.contract_type ? this.entryForm.value.contract_type.trim() : null,
            unit_rent_sm: this.entryForm.value.unit_rent_sm,
            unit_rent_tsubo: this.entryForm.value.unit_rent_tsubo,
            monthly_rent: this.entryForm.value.monthly_rent,
            date_of_rent_occurrence: this.entryForm.value.date_of_rent_occurrence ? this.validateMinDateFormat(this.entryForm.value.date_of_rent_occurrence) : null,
            initial_month_rent: this.entryForm.value.initial_month_rent,
            final_month_rent: this.entryForm.value.final_month_rent,
            unit_common_fees_sm: this.entryForm.value.unit_common_fees_sm,
            unit_common_fees_tsubo: this.entryForm.value.unit_common_fees_tsubo,
            monthly_common_fees: this.entryForm.value.monthly_common_fees,
            date_of_common_fee_occurrence: this.entryForm.value.date_of_common_fee_occurrence ? this.validateMinDateFormat(this.entryForm.value.date_of_common_fee_occurrence) : null,
            initial_month_common_fee: this.entryForm.value.initial_month_common_fee,
            final_month_common_fee: this.entryForm.value.final_month_common_fee,
            unit_of_total_rent_sm: this.entryForm.value.unit_of_total_rent_sm,
            unit_of_total_rent_tsubo: this.entryForm.value.unit_of_total_rent_tsubo,
            total_rent: this.entryForm.value.total_rent,
            total_initial_month_rent: this.entryForm.value.total_initial_month_rent,
            total_final_month_rent: this.entryForm.value.total_final_month_rent,
            number_of_deposit_months: this.entryForm.value.number_of_deposit_months,
            deposit: this.entryForm.value.deposit,
            date_of_contract_start: this.entryForm.value.date_of_contract_start ? this.validateMinDateFormat(this.entryForm.value.date_of_contract_start) : null,
            date_of_contract_end: this.entryForm.value.date_of_contract_end ? this.validateMinDateFormat(this.entryForm.value.date_of_contract_end) : null,
            automatic_extention: this.entryForm.value.automatic_extention,
            month_of_automatic_extention: this.entryForm.value.month_of_automatic_extention,
            period_of_cancel_notice: this.entryForm.value.period_of_cancel_notice,
            date_of_received_application_form_for_moving_in: this.entryForm.value.date_of_received_application_form_for_moving_in ? this.validateMinDateFormat(this.entryForm.value.date_of_received_application_form_for_moving_in) : null,
            date_of_contract_signed: this.entryForm.value.date_of_contract_signed ? this.validateMinDateFormat(this.entryForm.value.date_of_contract_signed) : null,
            document_delivery_date: this.entryForm.value.document_delivery_date ? this.validateMinDateFormat(this.entryForm.value.document_delivery_date) : null,
            date_of_noticing_contract_termination: this.entryForm.value.date_of_noticing_contract_termination ? this.validateMinDateFormat(this.entryForm.value.date_of_noticing_contract_termination) : null,
            cancellation_date: this.entryForm.value.cancellation_date ? this.validateMinDateFormat(this.entryForm.value.cancellation_date) : null,
            remarks_on_furniture_and_equipment: this.entryForm.value.remarks_on_furniture_and_equipment,
            other_remarks: this.entryForm.value.other_remarks,
            is_active: this.entryForm.value.is_active
        };

        formData.append('data', JSON.stringify(params));

        this._service.post('save-update-contract', formData).subscribe(
            data => {
                this.blockUI.stop();
                if (data.success) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.fromReset();
                    //this.getList();
                    this.router.navigate(['/contract-masters']);
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

    fromReset() {
        this.entryForm.reset();
        this.submitted = false;
        this.modalTitle = 'Add New Contract';
        this.btnSaveText = 'Save';
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
