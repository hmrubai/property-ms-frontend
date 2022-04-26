import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../_services/common.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../../_models/page';
import { environment } from '../../../environments/environment';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-beat-model-exam-list',
    templateUrl: './beat-model-exam-list.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BEATModelExamListComponent implements OnInit {
    currentUser: any = null;
    entryForm: FormGroup;
    uploadForm: FormGroup;
    featureHistoryList: FormArray;
    featureFormArray: any;

    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = 'Add Model Exam';
    btnSaveText = 'Save';

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    rows = [];
    itemTypeList: Array<any> = [];
    //roleTypes: Array<any> = [{ id: 'Anonymous', text: 'Anonymous' }, { id: 'Restricted', text: 'Restricted' }];
    loadingIndicator = false;
    ColumnMode = ColumnMode;

    urls = [];
    files = [];

    file: File;
    arrayBuffer: any;
    filelist: any;
    packageDetails;
    is_loaded = false;

    importedData:any;
    dataImported = false;

    scrollBarHorizontal = (window.innerWidth < 1200);
    baseUrl = environment.baseUrl;
    @ViewChild('dataTable') table: any;

    packageId;

    itemFile: File;
    itemUploadList: Array<any> = [];

    packagePrice = 0;

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private _authService: AuthenticationService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // this.page.pageNumber = 0;
        // this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };
        this._authService.currentUserDetails.subscribe((value) => {
            this.currentUser = value;
        });
        this.packageId = this.route.snapshot.paramMap.get("package_id");
    }

    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            beat_package_id: [null],
            name: [null, [Validators.required, Validators.maxLength(550)]],
            description: [null, [Validators.required, Validators.maxLength(550)]],
            // hints: [null],
            // model_answer: [null],
            // model_answer_attachment: [null],
            intro_video_url: [null, [Validators.required, Validators.maxLength(550)]],
            feature_thumbnail: [null],
            file: [null, [Validators.required]]
        });

        this.entryForm.controls['beat_package_id'].setValue(this.packageId);


        this.uploadForm = this.formBuilder.group({
            feature_thumbnail: ['']
        });

        this.getPackageDetails();
        this.getList();
    }

    get f() {
        return this.entryForm.controls;
    }

    get f_his(): FormArray {
        return this.entryForm.get('features') as FormArray;
    }


    // setPage(pageInfo) {
    //   this.page.pageNumber = pageInfo.offset;
    //   this.getList();
    // }

    addfile(event) {
        this.file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(this.file);
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.importedData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
            this.dataImported = true;
            this.filelist = this.file;
            console.log(this.importedData)
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

    getPackageDetails() {
        this._service.get('beat/package-details-by-id/' + this.packageId).subscribe(res => {
            if (res.status != 'Ok') {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.packageDetails = res.result;
            this.is_loaded = true;
        }, err => { }
        );
    }

    getList() {
        this.loadingIndicator = true;
        this._service.get('beat/model-exam/list/' + this.packageId).subscribe(res => {
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



    getItem(item, template: TemplateRef<any>) {

        this.modalTitle = 'Update Model Exam';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['description'].setValue(item.description);
        // this.entryForm.controls['hints'].setValue(item.hints);
        // this.entryForm.controls['model_answer'].setValue(item.model_answer);
        // this.entryForm.controls['model_answer_attachment'].setValue(item.model_answer_attachment);
        this.entryForm.controls['intro_video_url'].setValue(item.intro_video_url);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        if (this.importedData.length == 0) {
            this.toastr.error('No item add from excel file', 'Error!', { timeOut: 2000 });
            return;
        }

        const formData = new FormData();
        if(this.uploadForm.get('feature_thumbnail').value){
            formData.append('file', this.uploadForm.get('feature_thumbnail').value);
        }
        
        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        const obj = {
            id: this.entryForm.value.id ? this.entryForm.value.id : null,
            beat_package_id: this.packageId,
            name: this.entryForm.value.name.trim(),
            description: this.entryForm.value.description.trim(),
            // hints: this.entryForm.value.hints.trim(),
            // model_answer: this.entryForm.value.model_answer.trim(),
            // model_answer_attachment: this.entryForm.value.model_answer_attachment.trim(),
            intro_video_url: this.entryForm.value.intro_video_url ? this.entryForm.value.intro_video_url.trim() : '',
            created_by: this.currentUser.id,
            items: this.importedData
        };

        formData.append('data', JSON.stringify(obj));

        //console.log(obj)

        this._service.post('beat/model-exam-save-or-update', formData).subscribe(
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

        // this._service.post('bscs/item/check-not-found-item', { items: this.itemUploadList }).subscribe(
        //     data => {
        //         this.blockUI.stop();
        //         if (data.status == 'Ok') {
        //             if (data.result.length > 0) {
        //                 data.result
        //                 this.toastr.warning(data.result + ". Item not found", 'Warning!', { closeButton: true, disableTimeOut: true });
        //             } else {
        //                 this._service.post('bscs/package/save-or-update', obj).subscribe(
        //                     data => {
        //                         this.blockUI.stop();
        //                         if (data.status == 'Ok') {
        //                             this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
        //                             this.modalHide();
        //                             this.getList();

        //                         } else {
        //                             this.toastr.error(data.message, 'Error!', { timeOut: 2000 });
        //                         }
        //                     },
        //                     err => {
        //                         this.blockUI.stop();
        //                         this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
        //                     }
        //                 );
        //             }
        //         }
        //     },
        //     err => {
        //         this.blockUI.stop();
        //         this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
        //     }
        // );
    }

    toggleExpandRow(row) {
        console.log('Toggled Expand Row!', row);
        this.table.rowDetail.toggleExpandRow(row);
    }

    modalHide() {
        this.entryForm.reset();
        this.uploadForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Add Model Exam';
        this.btnSaveText = 'Save';
        this.packagePrice = 0;
    }

    openModal(template: TemplateRef<any>) {
        this.entryForm.controls['beat_package_id'].setValue(this.packageId);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }
}
