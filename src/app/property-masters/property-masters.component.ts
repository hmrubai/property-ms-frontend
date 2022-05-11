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
    selector: 'app-property-masters',
    templateUrl: './property-masters.component.html',
    encapsulation: ViewEncapsulation.None
})

export class PropertyMasterListComponent implements OnInit {
    currentUser: any = null;
    entryForm: FormGroup;
    uploadForm: FormGroup;
    featureHistoryList: FormArray;
    featureFormArray: any;

    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = 'Create Package';
    btnSaveText = 'Save';

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    rows = [];
    itemTypeList: Array<any> = [];
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
            property_name: [null, [Validators.required, Validators.maxLength(550)]],
            property_name_jp: [null, [Validators.maxLength(550)]],
            location: [null, [Validators.required, Validators.maxLength(550)]],
            gross_floor_area_sm: [0, [Validators.required]],
            gross_floor_area_tsubo: [0, [Validators.required]],
            private_area_sm: [0],
            private_area_tsubo: [0],
            building_structure: [null, [Validators.maxLength(550)]],
            story: [null, [Validators.maxLength(550)]],
            underground_story: [null, [Validators.maxLength(550)]],
            date_of_completion: [null],
            owner_on_the_registry: [null, [Validators.required, Validators.maxLength(550)]],
            owner_address: [null, [Validators.maxLength(550)]],
            property_image: [null, [Validators.maxLength(550)]],
            is_active: [true]
        });

        this.uploadForm = this.formBuilder.group({
            feature_thumbnail: ['']
        });

        // this.featureHistoryList = this.entryForm.get('features') as FormArray;
        // this.featureFormArray = this.entryForm.get('features')['controls'];

        // this.getItemTypeList();
        this.getList();
    }

    get f() {
        return this.entryForm.controls;
    }

    get f_his(): FormArray {
        return this.entryForm.get('features') as FormArray;
    }

    uploadItemFile(event) {
        this.packagePrice = 0;
        this.itemFile = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(this.itemFile);
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            const list = XLSX.utils.sheet_to_json(worksheet);
            this.itemUploadList = [];
            list.forEach((element, i) => {
                this.packagePrice += Number(element['unit_price']);
                this.itemUploadList.push({
                    bscs_item_id: element['id'],
                    unit_price: element['unit_price']
                })
            });
            console.log(this.itemUploadList)
            console.log(this.packagePrice)
            this.entryForm.controls['price_of_package'].setValue(this.packagePrice);
        }
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

    /*** Feature  **/
    initFeatureHistory() {
        return this.formBuilder.group({
            feature_name: [null, [Validators.required]]
        });
    }

    addFeatureHistory() {
        this.featureHistoryList.push(this.initFeatureHistory());
    }

    removeFeatureHistory(i) {
        if (this.featureHistoryList.length > 1) {
            this.featureHistoryList.removeAt(i);
        }
    }


    getItemTypeList() {
        this._service.get('bscs/type/list').subscribe(res => {
            if (res.status != 'Ok') {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.itemTypeList = res.result;
        }, err => { }
        );
    }

    getList() {
        this.loadingIndicator = true;

        this._service.get('property-list').subscribe(res => {
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
        this.modalTitle = 'Update Property';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['property_name'].setValue(item.property_name);
        this.entryForm.controls['property_name_jp'].setValue(item.property_name_jp);
        this.entryForm.controls['location'].setValue(item.location);
        this.entryForm.controls['gross_floor_area_sm'].setValue(item.gross_floor_area_sm);
        this.entryForm.controls['gross_floor_area_tsubo'].setValue(item.gross_floor_area_tsubo);
        this.entryForm.controls['private_area_sm'].setValue(item.private_area_sm);
        this.entryForm.controls['private_area_tsubo'].setValue(item.private_area_tsubo);
        this.entryForm.controls['building_structure'].setValue(item.building_structure);
        this.entryForm.controls['story'].setValue(item.story);
        this.entryForm.controls['underground_story'].setValue(item.underground_story);
        this.entryForm.controls['date_of_completion'].setValue(item.date_of_completion);
        this.entryForm.controls['owner_on_the_registry'].setValue(item.owner_on_the_registry);
        this.entryForm.controls['owner_address'].setValue(item.owner_address);
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
            property_name: this.entryForm.value.property_name.trim(),
            property_name_jp: this.entryForm.value.property_name_jp ? this.entryForm.value.property_name_jp.trim() : null,
            location: this.entryForm.value.location,
            gross_floor_area_sm: this.entryForm.value.gross_floor_area_sm,
            gross_floor_area_tsubo: this.entryForm.value.gross_floor_area_tsubo,
            private_area_sm: this.entryForm.value.private_area_sm,
            private_area_tsubo: this.entryForm.value.private_area_tsubo,
            building_structure: this.entryForm.value.building_structure,
            story: this.entryForm.value.story,
            underground_story: this.entryForm.value.underground_story,
            date_of_completion: this.entryForm.value.date_of_completion ? this.entryForm.value.date_of_completion : null,
            owner_on_the_registry: this.entryForm.value.owner_on_the_registry,
            owner_address: this.entryForm.value.owner_address,
            is_active: this.entryForm.value.is_active
        };

        formData.append('data', JSON.stringify(params));

        this._service.post('save-update-property', formData).subscribe(
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

    toggleExpandRow(row) {
        //console.log('Toggled Expand Row!', row);
        this.table.rowDetail.toggleExpandRow(row);
    }

    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Add New Property';
        this.btnSaveText = 'Save';
        this.packagePrice = 0;
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add New Property';
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
