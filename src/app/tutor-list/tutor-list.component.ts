import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { Page } from '../_models/page';
import { Editor, Toolbar } from 'ngx-editor';
import * as XLSX from 'xlsx';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';


@Component({
    selector: 'app-tutor-list',
    templateUrl: './tutor-list.component.html',
    styleUrls: ['./tutor-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class TutorListComponent implements OnInit, OnDestroy {

    baseUrl = environment.baseUrl;
    p: number = 1;
    entryForm: FormGroup;
    emailForm: FormGroup;
    notificationForm: FormGroup;
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

    modalTitle = 'Add Tutor';
    saveButtonText: string = 'Save';

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalConfigLg: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    emptyGuid = '00000000-0000-0000-0000-000000000000';
    rows = [];
    tutorList = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;

    scrollBarHorizontal = (window.innerWidth < 1200);



    // subjectList = [];
    // courseList = [];
    // instructorList = [];

    selectedTutorIds = [];
    selectedTutorsList = [];
    selectedTutorsListExcelData = [];

    userImage = '';
    bodyImage: any;
    notificationImage: any;
    attachmentfiles: any;

    tutor_status_list = [{ id: "Available", name: "Approved" }, { id: "Pending", name: "Pending" }, { id: "Suspended", name: "Suspended" }, { id: "On-Hold", name: "On-Hold" }]
    gender_list = [{ id: "", name: "Both Male & Female" }, { id: "Male", name: "Male" }, { id: "Female", name: "Female" }]
    mediumList = [];
    subjectList = [];

    districtList = [];
    areaList = [];

    bsConfig: Partial<BsDaterangepickerConfig>;
    bsValue: Date[] = [];

    constructor(
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private sanitizer: DomSanitizer,
        private toastr: ToastrService,
        private confirmService: ConfirmService,
        private dialog: MatDialog,
        private router: Router,
        private modalService: BsModalService,
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };

    }


    ngOnInit() {

        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            adaptivePosition: false,
            rangeInputFormat: 'DD MMM YYYY',
            maxDate: new Date(),
        });

        this.editor = new Editor();
        this.searchForm = this.formBuilder.group({
            search_item: [""],
            searchUniversity: [""],
            gender: [null],
            medium: [null],
            subject: [null],
            tutor_status: [null],
            district: [null],
            area: [null],
            is_bacbon_staff: [false],
        });

        this.searchForm.controls['tutor_status'].setValue('Available');
        this.searchForm.controls['gender'].setValue('');
        this.searchForm.controls['is_bacbon_staff'].setValue(false);
        this.entryForm = this.formBuilder.group({
            id: [null],
            teacher_id: [null, [Validators.required]],
        });
        this.emailForm = this.formBuilder.group({
            subject: [null, [Validators.required]],
            headlines: [null, [Validators.required]],
            bodyImage: [null],
            email_body: ['', [Validators.required]],
            attachment_file: [null]
        });
        this.notificationForm = this.formBuilder.group({
            title: [null, [Validators.required]],
            body: [null, [Validators.required]],
            notificationImage: [null],
            navigate_to_web_url: [null]
        });
        this.getList();
        //this.getCourseList();
        this.getMediumList();
        this.getDistrictList();
    }


    ngOnDestroy(): void {
        this.editor.destroy();
    }

    get f() {
        return this.entryForm.controls;
    }
    get e() {
        return this.emailForm.controls;
    }
    get n() {
        return this.notificationForm.controls;
    }

    // onSearchFieldChange(e){
    //   // this.searchForm.controls['search_item'].setValue(e);
    //   this.getListByFilter();
    // }

    onStatusChange(e) {
        if (e) {
            // this.page.pageNumber = 0;
            // this.page.size = 9;
            this.p = 1;
            this.clearData();
            this.getList();

        }

    }


    allClear() {
        // this.page.pageNumber = 0;
        // this.page.size = 9;
        this.p = 1;
        this.searchForm.reset();
        this.searchForm.controls['tutor_status'].setValue('Available');
        this.getList();
    }

    setImageUrl(imageFile) {
        let image = this.baseUrl + '/uploads/images/profile/' + imageFile;
        this.sanitize(image);
        return image;
    }

    checkTutorInSelectedList(tutorId) {
        return this.selectedTutorIds.includes(tutorId);
    }

    checkIndividually(e, tutor) {
        if (this.selectedTutorIds.includes(tutor.id)) {
            let index = this.selectedTutorIds.indexOf(tutor.id);
            this.selectedTutorIds.splice(index, 1);
            this.selectedTutorsList.splice(index, 1);
            this.selectedTutorsListExcelData.splice(index, 1);
        } else {
            this.selectedTutorIds.push(tutor.id);
            this.selectedTutorsList.push(tutor);

            this.selectedTutorsListExcelData.push({
                tutor_name: tutor.name,
                mobile: tutor.mobile_no_1,
                email: tutor.email,
                gender: tutor.gender,
                created_at: tutor.created_at
            });

            console.log(tutor);

        }
    }

    checkUncheckAll() {
        if (this.selectedTutorIds.length < this.tutorList.length) {
            this.selectedTutorIds = [];
            this.tutorList.forEach(tutor => {
                this.selectedTutorIds.push(tutor.id);
                this.selectedTutorsList.push(tutor);

                this.selectedTutorsListExcelData.push({
                    tutorName: tutor.name,
                    mobile_no: tutor.mobile_no_1,
                    email: tutor.email,
                    gender: tutor.gender,
                    created_at: tutor.created_at
                });


            });

        } else {
            this.selectedTutorIds = [];
            this.selectedTutorsList = [];
            this.selectedTutorsListExcelData = [];
        }
    }

    setPage(pageNumber) {
        this.page.pageNumber = pageNumber;
        this.getList();
    }

    checkAndSendEmail() {
        this.blockUI.start('Sending...');
        this._service.get('checkAndSendEmail').subscribe(res => {
            this.blockUI.stop();
            if (res.status == 'Ok') {
                this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
            } else {
                this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
            }
        },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            })

    }

    sendNotification() {
        // this.blockUI.start('Sending...');
        // this._service.get('send-tutors-message').subscribe(res => {
        //     this.blockUI.stop();
        //     if (res.status == 'Ok') {
        //         this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
        //     } else {
        //         this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
        //     }
        // },
        //     err => {
        //         this.blockUI.stop();
        //         this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        //     })



        this.submitted = true;
        if (this.notificationForm.invalid) {
            return;
        }

        if (this.selectedTutorIds.length == 0) {
            this.toastr.error("No Tutor Selected", 'Error!', { closeButton: true, disableTimeOut: true });
            return;
        }

        this.blockUI.start('Sending...');
        let formData = new FormData();

        let data = {
            ids: this.selectedTutorIds,
            title: this.notificationForm.value.title.trim(),
            message: this.notificationForm.value.body.trim(),
            navigate_to_web_url: this.notificationForm.value.navigate_to_web_url ? this.notificationForm.value.navigate_to_web_url.trim() : null
        };
        if (this.notificationImage) {
            formData.append("thumbnail", this.notificationImage)
        }
        formData.append("data", JSON.stringify(data));
        const request = this._service.post('send-tutors-message', formData);
        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.status == 'Ok') {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.hideNotificationModal();
                    this.getList();
                    this.clearData();
                    this.notificationImage = null;
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



    getMediumList() {
        this._service.get('medium').subscribe(res => {
            this.mediumList = res;
        }, err => { }
        );
    }

    onMediumChange(item) {
        this.subjectList = [];
        this.searchForm.controls['subject'].setValue(null);
        if (item) {
            this.subjectList = item.subjects
        }

    }

    onMediumClear() {
        this.subjectList = [];
        this.searchForm.controls['subject'].setValue(null);
    }



    getDistrictList() {
        this._service.get('getDistrictListWithArea').subscribe(res => {
            this.districtList = res;
        }, err => { }
        );
    }

    onDistrictChange(item) {
        this.areaList = [];
        this.searchForm.controls['area'].setValue(null);
        if (item) {
            this.areaList = item.areas
        }

    }

    onDistrictClear() {
        this.areaList = [];
        this.searchForm.controls['area'].setValue(null);
    }

    getList() {
        this.tutorList = [];
        this.blockUI.start('Getting Infromations...');
        this._service.get('tutor/GetAllTutorListByStatusForAdmin/' + this.searchForm.value.tutor_status).subscribe(res => {
            // if (!res.status) {
            //     this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
            //     return;
            // }
            this.tutorList = res.records;
            // this.page.pageTotalElements = res.records.length;
            // this.page.totalElements = res.total_number;
            // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);

            this.blockUI.stop()
        }, err => { this.blockUI.stop() }
        );
    }




    getListByFilter() {
        this.tutorList = [];
        this.blockUI.start('Getting Infromations...');
        const obj = {
            area_id: this.searchForm.value.area ? this.searchForm.value.area.id : null,
            district_id: this.searchForm.value.district ? this.searchForm.value.district.id : null,
            from: this.bsValue.length > 0 ? moment(this.bsValue[0]).format("DD-MMM-YYYY") : null,
            to: this.bsValue.length > 0 ? moment(this.bsValue[1]).format("DD-MMM-YYYY") : null,
            gender: this.searchForm.value.gender ? this.searchForm.value.gender : "",
            is_bacbon_staff: this.searchForm.value.is_bacbon_staff,
            is_bnfe: false,
            is_bslc: false,
            is_e_edu1: false,
            is_e_edu2: false,
            is_slc: false,
            medium_id: this.searchForm.value.medium ? this.searchForm.value.medium.id : null,
            searchUniversity: this.searchForm.value.searchUniversity ? this.searchForm.value.searchUniversity.trim() : "",
            search_item: this.searchForm.value.search_item ? this.searchForm.value.search_item.trim() : "",
            status: this.searchForm.value.tutor_status,
            subject_id: this.searchForm.value.subject ? this.searchForm.value.subject.id : null
        }
        this._service.post('tutor/searchTutorByFields', obj).subscribe(res => {
            this.tutorList = res.records;
            this.blockUI.stop()
        }, err => { this.blockUI.stop() }
        );
    }



    handleBodyImageUpload(e) {
        if (e.target.files && e.target.files.length) {
            this.bodyImage = e.target.files[0];
        }
        console.log(this.bodyImage)
    }

    handleNotificationImageUpload(e) {
        if (e.target.files && e.target.files.length) {
            this.notificationImage = e.target.files[0];
        }
    }

    handleAttachmentUpload(e) {
        if (e.target.files && e.target.files.length) {
            this.attachmentfiles = e.target.files;
        }
        console.log(this.attachmentfiles)
    }

    downloadTutorExcel() {

        const workBook = XLSX.utils.book_new(); // create a new blank book
        const workSheet = XLSX.utils.json_to_sheet(this.selectedTutorsListExcelData);

        XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
        XLSX.writeFile(workBook, 'Tutors.xlsx'); // initiate a file download in browser
    }



    sendEmail() {
        this.submitted = true;
        if (this.emailForm.invalid) {
            return;
        }

        if (this.selectedTutorIds.length == 0) {
            this.toastr.error("No Tutor Selected", 'Error!', { closeButton: true, disableTimeOut: true });
            return;
        }

        this.blockUI.start('Sending...');
        let formData = new FormData();
        if (this.attachmentfiles && this.attachmentfiles.length > 0) {
            for (var i = 0; i < this.attachmentfiles.length; i++) {
                let file = this.attachmentfiles[i];
                formData.append("files[" + i + "]", file);
            }
        }

        if (this.bodyImage) {
            formData.append("bodyImage", this.bodyImage)
        }

        const emailObj = {
            subject: this.emailForm.value.subject.trim(),
            headlines: this.emailForm.value.headlines.trim(),
            body: this.emailForm.value.email_body
        }

        let data = {
            tutorids: this.selectedTutorIds,
            emailData: emailObj
        };

        formData.append("data", JSON.stringify(data));
        const request = this._service.post('saveNotificationEmail', formData);
        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.status == 'Ok') {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.hideEmailModal();
                    this.getList();
                    this.clearData();
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





    changeStatus(status, tutor) {
        if (!status) {
            return;
        }
        let message = tutor.name + ' is in ' + status + '.';
        this.confirmService.confirm('Are you sure?', 'Do you want to change the status?')
            .subscribe(
                result => {
                    if (result) {
                        let params = {
                            status: status
                        }

                        this.blockUI.start('Changing status...');
                        this._service.post('updateTutorStatuById/' + tutor.id, params).subscribe(res => {
                            this.toastr.success(message, 'Successful!');
                            this.getList()
                            this.blockUI.stop();
                        }, err => {
                            //this.toastr.warning(err.message, 'Attention!');
                            this.blockUI.stop();
                        });
                    }
                }
            );

    }

    // findInstructor(data, template: TemplateRef<any>) {
    //     //console.log(data);
    //     this.modalTitle = 'Select Instructor';
    //     this.saveButtonText = 'Save';
    //     this._service.get('admin/teacher/list/as-instructor/' + data.id).subscribe(res => {
    //         if (!res.status) {
    //             this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
    //             return;
    //         }
    //         this.entryForm.controls['id'].setValue(data.id);
    //         this.instructorList = res.data
    //         this.modalRef = this.modalService.show(template, this.modalConfig);
    //     }, err => {
    //         this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
    //         setTimeout(() => {
    //             this.loadingIndicator = false;
    //         }, 1000);
    //     }
    //     );
    // }

    openEmailModal(template: TemplateRef<any>) {
        // this.editor = new Editor();
        this.emailForm.controls['email_body'].setValue('');
        this.modalRef = this.modalService.show(template, this.modalConfigLg);
    }
    openNotificationModal(template: TemplateRef<any>) {
        // this.editor = new Editor();
        this.modalRef = this.modalService.show(template, this.modalConfigLg);
    }

    hideEmailModal() {
        this.emailForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        //  this.editor.destroy();
    }

    hideNotificationModal() {
        this.notificationForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        //  this.editor.destroy();
    }


    // getItem(row) {
    //     this.getSubjectList();
    //     this.formTitle = 'Update Chapter';
    //     this.btnSaveText = 'Update';
    //     this.entryForm.controls['id'].setValue(row.id);
    //     this.entryForm.controls['name_en'].setValue(row.chapter_name);
    //     this.entryForm.controls['course_id'].setValue(row.course_id);
    //     this.entryForm.controls['subject_id'].setValue(row.subject_id);
    //     this.entryForm.controls['is_active'].setValue(row.is_active);
    // }

    onSetInstructorSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving...');

        const request = this._service.post('admin/set/instructor', this.entryForm.value);

        request.subscribe(
            data => {

                console.log(data)
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.clearForm();
                    this.modalHide();
                    this.getList();
                    // this.getSubjectList();
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

    // onFormSubmit() {
    //     this.submitted = true;
    //     if (this.entryForm.invalid) {
    //         return;
    //     }
    //     this.blockUI.start('Saving...');
    //     const obj = {
    //         id: this.entryForm.value.id ? this.entryForm.value.id : 0,
    //         name_en: this.entryForm.value.name_en.trim(),
    //         course_id: this.entryForm.value.course_id,
    //         subject_id: this.entryForm.value.subject_id,
    //         is_active: this.entryForm.value.is_active
    //     };

    //     const request = this._service.post('admin/chapter/save-or-update', obj);

    //     request.subscribe(
    //         data => {
    //             this.blockUI.stop();
    //             if (data.status) {
    //                 this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
    //                 this.clearForm();
    //                 this.getList();
    //                 this.getSubjectList();
    //             } else {
    //                 this.toastr.error(data.message, 'Error!', { closeButton: true, disableTimeOut: true });
    //             }
    //         },
    //         err => {
    //             this.blockUI.stop();
    //             this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
    //         }
    //     );

    // }

    clearForm() {
        this.entryForm.reset();
        this.submitted = false;
        this.formTitle = 'Select Instructor';
        this.btnSaveText = 'Save';
    }

    clearData() {
        this.selectedTutorIds = [];
        this.selectedTutorsList = [];
        this.selectedTutorsListExcelData = [];
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.submitted = false;
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Upload subject using xlsx';
        this.saveButtonText = 'Upload';
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }
}
