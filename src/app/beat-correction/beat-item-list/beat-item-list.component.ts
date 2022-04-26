import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../../_models/page';
import { environment } from '../../../environments/environment';


@Component({
    selector: 'app-beat-item-list',
    templateUrl: './beat-item-list.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BEATItemListComponent implements OnInit {

    entryForm: FormGroup;
    entryVideoForm: FormGroup;
    uploadForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = 'Create Item';
    btnSaveText = 'Save';

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    rows = [];
    itemTypeList: Array<any> = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    packageList: Array<any> = [];
    modelExamList: Array<any> = [];

    @ViewChild('dataTable') table: any;

    packageId;
    modelExamId;

    urls = [];
    files = [];

    scrollBarHorizontal = (window.innerWidth < 1200);
    baseUrl = environment.baseUrl;

    selectedInstitute;
    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
        private router: Router
    ) {
        // this.page.pageNumber = 0;
        // this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };
    }


    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            title: [null, [Validators.required, Validators.maxLength(550)]],
            description: [null, [Validators.required, Validators.maxLength(250)]],
            mark: [null],
            min_word_count: [null, [Validators.required]],
            max_word_count: [null, [Validators.required]],
            unit_price: [null, [Validators.required]],
            beat_item_type_id: [null, [Validators.required]],
            is_active: [true]
        });

        this.entryVideoForm = this.formBuilder.group({
            id: [null],
            beat_model_exam_item_id: [null],
            intro_video_url: [null, [Validators.required, Validators.maxLength(250)]],
            is_active: [true]
        });

        this.uploadForm = this.formBuilder.group({
            feature_thumbnail: ['']
        });

        this.getPackageList();
        //this.getList();
    }

    get f() {
        return this.entryForm.controls;
    }

    get vf() {
        return this.entryVideoForm.controls;
    }

    getPackageList() {
        this._service.get('beat/package/dropdown-list').subscribe(res => {
            if (res.status != 'Ok') {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.packageList = res.result;
        }, err => { }
        );
    }

    onPackageChange(item) {
        if(this.packageId){
            this._service.get('beat/model-exam-dropdown-list-by-id/' + this.packageId).subscribe(res => {
                if (res.status != 'Ok') {
                    this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                    return;
                }
                this.modelExamList = res.result;
                this.rows = [];
                this.modelExamId = null;
            }, err => { }
            );
        }else{
            this.modelExamId = null;
            this.rows = [];
            this.modelExamList = [];
        }
    }

    onModelExamChange(model_exam){
        if(this.modelExamId){
            this.getList();
        }
    }

    getList() {
        this.loadingIndicator = true;
        this._service.get('beat/model-exam-item-list-by-id/' + this.modelExamId).subscribe(res => {
            if (res.status != 'Ok') {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.rows = res.result;
            // this.page.totalElements = res.Total;
            // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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

    getItem(item, template: TemplateRef<any>) {

        this.modalTitle = 'Update Item';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['title'].setValue(item.title);
        this.entryForm.controls['description'].setValue(item.description);
        this.entryForm.controls['mark'].setValue(item.mark);
        this.entryForm.controls['min_word_count'].setValue(item.min_word_count);
        this.entryForm.controls['max_word_count'].setValue(item.max_word_count);
        this.entryForm.controls['unit_price'].setValue(item.unit_price);
        this.entryForm.controls['beat_item_type_id'].setValue(item.beat_item_type_id);
        this.entryForm.controls['is_active'].setValue(item.is_active);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    updateVideoItem(item, template: TemplateRef<any>) {

        this.modalTitle = 'Update Solved Video';
        this.btnSaveText = 'Update';

        this.entryVideoForm.controls['id'].setValue(item.id);
        this.entryVideoForm.controls['beat_model_exam_item_id'].setValue(item.beat_model_exam_item_id);
        this.entryVideoForm.controls['intro_video_url'].setValue(item.intro_video_url);
        this.entryVideoForm.controls['is_active'].setValue(item.is_active);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    addVideoItem(item, template: TemplateRef<any>) {

        this.modalTitle = 'Add Solved Video';
        this.btnSaveText = 'Save';

        this.entryVideoForm.controls['beat_model_exam_item_id'].setValue(item.id);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    onFormVideoSubmit() {
        this.submitted = true;
        if (this.entryVideoForm.invalid) {
            return;
        }

        this.entryVideoForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        const obj = {
            id: this.entryVideoForm.value.id ? this.entryVideoForm.value.id : null,
            beat_model_exam_item_id: this.entryVideoForm.value.beat_model_exam_item_id,
            intro_video_url: this.entryVideoForm.value.intro_video_url.trim(),
            is_active: this.entryVideoForm.value.is_active
        };

        const formData = new FormData();
        if(this.uploadForm.get('feature_thumbnail').value){
            formData.append('file', this.uploadForm.get('feature_thumbnail').value);
        }

        formData.append('data', JSON.stringify(obj));

        this._service.post('beat/model-exam-item-intro-videos-save-or-update', formData).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status == 'Ok') {
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

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        const obj = {
            id: this.entryForm.value.id ? this.entryForm.value.id : null,
            title: this.entryForm.value.title.trim(),
            description: this.entryForm.value.description.trim(),
            mark: this.entryForm.value.mark,
            min_word_count: this.entryForm.value.min_word_count,
            max_word_count: this.entryForm.value.max_word_count,
            unit_price: this.entryForm.value.unit_price,
            beat_item_type_id: this.entryForm.value.beat_item_type_id,
            is_active: this.entryForm.value.is_active
        };

        this._service.post('beat/item-save-or-update', obj).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status == 'Ok') {
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
        this.entryVideoForm.reset();
        this.entryVideoForm.controls['is_active'].setValue(true);
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Add Solved Video';
        this.btnSaveText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.entryForm.controls['is_active'].setValue(true);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }
}
