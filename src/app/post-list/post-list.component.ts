import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { AuthenticationService } from '../_services/authentication.service';
import { countryList } from '../_services/country.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { Page } from '../_models/page';
import { Editor, Toolbar } from 'ngx-editor';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class PostListComponent implements OnInit, OnDestroy {

    baseUrl = environment.baseUrl;
    apiUrl = environment.apiUrl;
    currentUser: any = null;
    entryForm: FormGroup;
    submitted = false;
    searchForm: FormGroup;
    @BlockUI() blockUI: NgBlockUI;
    formTitle = 'Tutor List';
    btnSaveText = 'Save';
    editor: Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    modalTitle = 'Create Post';
    saveButtonText: string = 'Save';

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalConfigLg: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;
    imagePath: string;


    page = new Page();
    emptyGuid = '00000000-0000-0000-0000-000000000000';
    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    scrollBarHorizontal = (window.innerWidth < 1200);


    bsConfig: Partial<BsDaterangepickerConfig>;
    bsValue: Date[] = [];

    userImage = '';
    bodyImage: any;

    post_type_list = [{ id: "Job Career", name: "Job Career" }, { id: "Study Abroad", name: "Study Abroad" }]
    post_status_list = [{ id: "Published", name: "Published" }, { id: "Draft", name: "Draft" }]
    showCountryDiv = false;
    countryList = countryList;


    imageChangedEvent: any = '';
    croppedImage: any = '';
    isShownUpload = true;
    showCropper = false;
    isCropper = true;

    constructor(
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private sanitizer: DomSanitizer,
        private toastr: ToastrService,
        private confirmService: ConfirmService,
        private _authService: AuthenticationService,
        private dialog: MatDialog,
        private router: Router,
        private modalService: BsModalService,
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };
        this._authService.currentUserDetails.subscribe((value) => {
            this.currentUser = value;
        });

    }


    ngOnInit() {
        this.bsValue = null;
        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            adaptivePosition: true,
            rangeInputFormat: 'DD MMM YYYY',
            maxDate: new Date()
        });

        this.editor = new Editor();
        this.searchForm = this.formBuilder.group({
            country: [null],
            post_type: ['']
        });

        this.entryForm = this.formBuilder.group({
            id: [null],
            post_content: ['', [Validators.required]],
            post_title: [null, [Validators.required]],
            post_excerpt: [null],
            post_status: [null, [Validators.required]],
            post_type: [null, [Validators.required]],
            country: [null],
            featured_image: [null]
        });
     
          this.getList();
        //this.getCourseList();
        //this.getSubjectList();
    }


    ngOnDestroy(): void {
        this.editor.destroy();
    }

    get f() {
        return this.entryForm.controls;
    }



    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        this.isShownUpload = false;
        this.isCropper = true;
        this.imagePath = '';
      }
      imageCropped (event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.bodyImage  = this.base64ToFile(
            event.base64,
            this.imageChangedEvent.target.files[0].name,
          );

      }
      cropperReady() {
      }
      loadImageFailed () {
      }
      imageLoaded() {
        this.showCropper = true;
      }
      removeImage () {
        this.croppedImage = null;
        this.showCropper = false;
        this.imageChangedEvent = null;
        this.isShownUpload = true;
        this.isCropper = true;
        this.entryForm.controls['featured_image'].setValue(null);
      }
      approveImage () {
        this.showCropper = false;
        this.isCropper = false;
        this.imageChangedEvent = null;
      }



    imagePreview(e) {

        const file = (e.target as HTMLInputElement).files[0];
        if (file) {           
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePath = reader.result as string;
            }
            reader.readAsDataURL(file)
            this.bodyImage = e.target.files[0];
        } else {
            this.imagePath = '';
        }
    }

    onTypeChange(e) {
        this.searchForm.controls['country'].setValue(null);
        if (e.name == "Study Abroad") {
            this.showCountryDiv = true;
        } else {
            this.showCountryDiv = false;
        }
    }

    onCountryChange(e) {


    }


    allClear() {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.searchForm.reset();
        this.getList();
    }




    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    search(){
        this.getList();
    }

    getList() {
        this.loadingIndicator = true;
        const obj = {
            pageSize: this.page.size,
            pageNumber: this.page.pageNumber ,
            start_date: this.bsValue ? moment(this.bsValue[0]).format("DD-MMM-YYYY") : '',
            end_date: this.bsValue ? moment(this.bsValue[1]).format("DD-MMM-YYYY") : '',
            post_type: this.searchForm.value.post_type ? this.searchForm.value.post_type : '',
            country: this.searchForm.value.country ? this.searchForm.value.country : ''
        };
        this._service.get('post/get-post-list', obj).subscribe(res => {
            if (!res) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            //   this.tempRows = res;
            this.rows = res.records;
            this.page.totalElements = res.count;
            this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);

            // if(this.supplierList.length > 0)this.columnsWithSearch = Object.keys(this.supplierList[0]);
            // this.page.totalElements = res.Total;
            // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }, err => {
            this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }
        );
    }


    // handleBodyImageUpload(e) {
    //     if (e.target.files && e.target.files.length) {
    //         this.bodyImage = e.target.files[0];
    //     }
    // }



    // changeStatus(status, tutor) {
    //     if (!status) {
    //         return;
    //     }
    //     let message = tutor.name + ' is in ' + status + '.';
    //     this.confirmService.confirm('Are you sure?', 'Do you want to change the status?')
    //         .subscribe(
    //             result => {
    //                 if (result) {
    //                     let params = {
    //                         status: status
    //                     }

    //                     this.blockUI.start('Changing status...');
    //                     this._service.post('updateTutorStatuById/' + tutor.id, params).subscribe(res => {
    //                         this.toastr.success(message, 'Successful!');
    //                         this.getList()
    //                         this.blockUI.stop();
    //                     }, err => {
    //                         //this.toastr.warning(err.message, 'Attention!');
    //                         this.blockUI.stop();
    //                     });
    //                 }
    //             }
    //         );

    // }




    getItem(item,template: TemplateRef<any>) {
        this.blockUI.start('Getting Data...');
        this.formTitle = 'Update Post';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['post_content'].setValue(item.post_content);
        this.entryForm.controls['post_title'].setValue(item.post_title);
        this.entryForm.controls['post_status'].setValue(item.post_status);
        this.entryForm.controls['post_type'].setValue(item.post_type);
        this.entryForm.controls['post_excerpt'].setValue(item.post_excerpt);
        if(item.post_type == "Study Abroad") {
            this.showCountryDiv = true;
            this.entryForm.controls['country'].setValue(item.country);
        } else {
            this.showCountryDiv = false;
        }
      

        if(item.featured_image){
            this.imagePath = this.baseUrl+'/'+item.featured_image;
        }        
        this.blockUI.stop();
        this.modalRef = this.modalService.show(template, this.modalConfigLg);
    }



    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving...');
        let formData = new FormData();
        const obj = {
            id: this.entryForm.value.id ? this.entryForm.value.id : 0,
            post_author: this.currentUser.id,
            post_content: this.entryForm.value.post_content.trim(),
            post_title: this.entryForm.value.post_title.trim(),
            post_excerpt: this.entryForm.value.post_excerpt ? this.entryForm.value.post_excerpt.trim() : null,
            post_status: this.entryForm.value.post_status,
            post_type: this.entryForm.value.post_type,
            country: this.entryForm.value.country
        };

    
        if (this.bodyImage) {
            formData.append("featured_image", this.bodyImage)
        }
        formData.append("data", JSON.stringify(obj));
        const request = this._service.post('post/create-or-update', formData);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.status == 'Ok') {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                   this.getList();
                } else {
                    this.toastr.error(data.message, 'Error!', { closeButton: true, disableTimeOut: true });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            }
        );

    }




    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.showCountryDiv = false;
      //  this.editor.destroy();
     
        this.imagePath = '';


        this.croppedImage = null;
        this.showCropper = false;
        this.imageChangedEvent = null;
        this.isShownUpload = false;
        this.isCropper = false;
        this.entryForm.controls['featured_image'].setValue(null);

    }

    openModal(template: TemplateRef<any>) {
      // this.editor = new Editor();
      this.entryForm.controls['post_content'].setValue('');
        this.modalRef = this.modalService.show(template, this.modalConfigLg);
    }

    base64ToFile(data, filename) {

        const arr = data.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
    
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
    
        return new File([u8arr], filename, { type: mime });
      }
}
