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
    selector: 'app-beat-item-type',
    templateUrl: './beat-item-type.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BEATItemTypeComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = 'Add Item Type';
    btnSaveText = 'Save';

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    rows = [];
    itemTypeList: Array<any> = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;

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
            name: [null, [Validators.required, Validators.maxLength(550)]],
            value: [null, [Validators.required, Validators.maxLength(250)]],
            is_b_unit: [true],
            is_c_unit: [false],
            is_active: [true]
        });

        this.getItemTypeList();
    }

    get f() {
        return this.entryForm.controls;
    }

    getItemTypeList() {
        this._service.get('beat/type-list').subscribe(res => {
            if (res.status != 'Ok') {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.itemTypeList = res.result;
        }, err => { }
        );
    }

    getItem(item, template: TemplateRef<any>) {
        this.modalTitle = 'Update Item Type';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['value'].setValue(item.value);
        this.entryForm.controls['is_b_unit'].setValue(item.is_b_unit ? true : false);
        this.entryForm.controls['is_c_unit'].setValue(item.is_c_unit ? true : false);
        this.entryForm.controls['is_active'].setValue(item.is_active);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }
        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');
        const obj = {
            id: this.entryForm.value.id ? this.entryForm.value.id : null,
            name: this.entryForm.value.name.trim(),
            value: this.entryForm.value.value.trim(),
            mark: this.entryForm.value.mark,
            is_b_unit: this.entryForm.value.is_b_unit ? 1 : 0,
            is_c_unit: this.entryForm.value.is_c_unit ? 1 : 0,
            is_active: this.entryForm.value.is_active
        };

        this._service.post('beat/type-save-or-update', obj).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status == 'Ok') {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getItemTypeList();
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
        this.modalTitle = 'Add Type';
        this.btnSaveText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add Type';
        this.entryForm.controls['is_active'].setValue(true);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }
}
