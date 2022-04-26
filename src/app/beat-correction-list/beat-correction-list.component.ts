import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { Page } from '../_models/page';
import { BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { AuthenticationService } from './../_services/authentication.service';

@Component({
    selector: 'app-beat-correction-list',
    templateUrl: './beat-correction-list.component.html',
    styleUrls: ['./beat-correction-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BEATCorrectionListComponent implements OnInit {

    baseUrl = environment.baseUrl;

    searchForm: FormGroup;
    courseForm: FormGroup;
    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    formTitle = 'SEW Correction List';
    btnSaveText = 'Save';
    projectId: any;

    modalTitle = 'Add Correction';
    modalTitleCourse = 'New Written';
    saveButtonText: string = 'Save';

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalLgConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;
    modalRefcourse: BsModalRef;
    modalRefStudent: BsModalRef;

    page = new Page();
    emptyGuid = '00000000-0000-0000-0000-000000000000';
    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;

    scrollBarHorizontal = (window.innerWidth < 1200);

    projectList = [];
    instituteList = [];

    subjectList = [];
    courseList = [];
    instructorList = [];
    statusList = [{ id: null, name: 'All' }, { id: "Accepted", name: 'Accepted' }, { id: "Answered", name: 'Answered' }, { id: "Corrected", name: 'Corrected' }]
    correctionList = [];
    studentList = [];
    selectedStudentIds = [];
    selectedStudentList = [];
    typeList = [];

    userImage = '';

    activePage = 0;
    totalCount = 0;
    bsConfig: Partial<BsDaterangepickerConfig>;
    bsConfigWritten: Partial<BsDaterangepickerConfig>;
    bsValue: Date[] = [];

    currentUser: any;

    constructor(
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private sanitizer: DomSanitizer,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private router: Router,
        private modalService: BsModalService,
        private authService: AuthenticationService,
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };

        this.authService.currentUserDetails.subscribe((value) => {
            this.currentUser = value;
        });
        //this.currentUser = this.authService.currentUserDetails.value;
    }


    ngOnInit() {


        this.bsValue = null;
        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            adaptivePosition: true,
            rangeInputFormat: 'DD MMM YYYY',
            maxDate: new Date()
        });
        this.bsConfigWritten = Object.assign({}, {
            isAnimated: true,
            adaptivePosition: true,
            rangeInputFormat: 'DD MMM YYYY',
        });

        this.courseForm = this.formBuilder.group({
            projectId: [null, [Validators.required]],
            typeId: [null, [Validators.required]],
            title: [null, [Validators.required]],
            description: [null],
            date: [null],
            mark: [null,[Validators.required]],
            name: [null,[Validators.required]],
        });
        this.searchForm = this.formBuilder.group({
            teacher_name: [null],
            student_name: [null],
            institute: [null],
            status: [null],
            project: [null],
            type: [null]
        });
        this.entryForm = this.formBuilder.group({
            id: [null],
            teacher_id: [null, [Validators.required]],
        });
        this.getList();
        this.getTypeList();
    }

    get f() {
        return this.entryForm.controls;
    }
    get c() {
        return this.courseForm.controls;
    }



    setImageUrl(imageFile) {
        let image = this.baseUrl + '/uploads/images/profile/' + imageFile;
        this.sanitize(image);
        return image;
    }

    getStudentList() {
        this.loadingIndicator = true;
        this._service.get('get-project-wise-students/' + this.projectId).subscribe(res => {

            this.studentList = res;

            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }
        );
    }


    getInstituteList() {
        this.blockUI.start('Getting data...');
        this._service.get('bscs/institute/get-dropdown-list').subscribe(res => {
            this.blockUI.stop();
            if (res.status != 'Ok') {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.instituteList = res.result;

        }, err => { this.blockUI.stop(); }
        );
    }

    getTypeList() {
        this.blockUI.start('Getting data...');
        this._service.get('beat/type-list').subscribe(res => {
            this.blockUI.stop();
            if (res.status != 'Ok') {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.typeList = res.result;

        }, err => { this.blockUI.stop(); }
        );
    }

    /*getProjectList() {
        this._service.get('getProjectListAdmin').subscribe(res => {
            this.projectList = res;
        }, err => { }
        );
    }
    getSubjectList() {
        this._service.get('admin/subject/get-list').subscribe(res => {
            this.subjectList = res.data;
        }, err => { }
        );
    }

    getSubjectListByCourse(item) {
        this._service.get('admin/subject/list/frontend/' + item.id).subscribe(res => {
            this.subjectList = res.data;
        }, err => { }
        );
    }

    getCourseList() {
        this._service.get('admin/course/get-list').subscribe(res => {
            this.courseList = res.data;
        }, err => { }
        );
    }*/

    onTutorChange(e) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.getList();
    }
    onStudentChange(e) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.getList();
    }
    onStatusChange(e) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.getList();
    }
    onTypeChange(e) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.getList();
    }
    onDateValueChange(e) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.bsValue = e;
        this.getList();
    }

    allClear() {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.searchForm.reset();
        this.bsValue = null;
        this.getList();
    }

    setPage(pageNumber) {
        this.page.pageNumber = pageNumber;
        this.getList();
    }

    getList() {
        this.blockUI.start('loading...');
        this.correctionList = [];

        let params = {
            pageNumber: this.page.pageNumber - 1,// this.activePage,
            pageSize: this.page.size,
            fromDate: this.bsValue ? moment(this.bsValue[0]).format("DD-MMM-YYYY") : null,
            toDate: this.bsValue ? moment(this.bsValue[1]).format("DD-MMM-YYYY") : null,
            status_id: this.searchForm.value.status,
            type: this.searchForm.value.type ? this.searchForm.value.type : null,
            student_name: this.searchForm.value.student_name ? this.searchForm.value.student_name : null,
            tutor_name: this.searchForm.value.teacher_name ? this.searchForm.value.teacher_name : null,
        }


        this._service.get('admin/beat/correction-list', params).subscribe(res => {
            this.correctionList = res.result;
            this.page.pageTotalElements = this.correctionList.length;
            this.page.totalElements = res.total_page;
            this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
            this.blockUI.stop();
        }, err => {
            this.blockUI.stop();
         }
        );

        // this._service.post('search-written-practice-correction-paginated-list-v2', params).subscribe(res => {
        //     this.blockUI.stop();
        //     // if (!res.status) {
        //     //     this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
        //     //     return;
        //     // }
        //     this.correctionList = res.records;
        //     // this.totalCount = res.total_page;

        //     this.page.pageTotalElements = res.records.length;
        //     this.page.totalElements = res.total_page;
        //     this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);


        // }, err => {
        //     this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        //     this.blockUI.stop();
        // }
        // );
    }

    public export() {
        this.blockUI.start('Generating data...');
        let params = {
            // fromDate: this.bsValue ? moment(this.bsValue[0]).format("DD-MMM-YYYY") : null,
            fromDate: this.bsValue ? moment(this.bsValue[0]).format("DD-MMM-YYYY") : null,
            pageNumber: this.page.pageNumber,// this.activePage,
            pageSize: this.page.size,
            projectId: this.searchForm.value.project ? this.searchForm.value.project : 4,
            status_id: this.searchForm.value.status,
            student_name: this.searchForm.value.student_name ? this.searchForm.value.student_name : null,
            //toDate: this.bsValue ? moment(this.bsValue[1]).format("DD-MMM-YYYY")  : null,
            toDate: this.bsValue ? moment(this.bsValue[1]).format("DD-MMM-YYYY") : null,
            tutor_name: this.searchForm.value.teacher_name ? this.searchForm.value.teacher_name : null,
            type: this.searchForm.value.type ? this.searchForm.value.type : null,
            bscs_institute_id: this.searchForm.value.institute ? this.searchForm.value.institute : null

        }

        this._service.post('search-written-practice-correction-paginated-list-excel-data', params).subscribe(res => {
            if (res.records.length > 0) {
                let readyToExport = []
                res.records.forEach(element => {
                    readyToExport.push({
                        course_name: element.course_name,
                        type: element.type,
                        title: element.title,
                        description: element.description,
                        min_word_count: element.min_word_count,
                        max_word_count: element.max_word_count,
                        created_date: element.created_at,
                        answer_date: element.answer_date,
                        complete_date: element.complete_date,
                        given_mark: element.given_mark,
                        student_name: element.student_name,
                        student_mobile_no: element.student_mobile_no,
                        tutor_name: element.tutor_name,
                        tutor_mobile_no: element.tutor_mobile_no,
                    })
                });

                const workBook = XLSX.utils.book_new(); // create a new blank book
                const workSheet = XLSX.utils.json_to_sheet(readyToExport);

                XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
                XLSX.writeFile(workBook, 'report.xlsx'); // initiate a file download in browser

            }
            this.blockUI.stop();

        }, err => {
            this.blockUI.stop();
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });

        }
        );


    }

    findInstructor(data, template: TemplateRef<any>) {
        //console.log(data);
        this.modalTitle = 'Select Instructor';
        this.saveButtonText = 'Save';
        this._service.get('admin/teacher/list/as-instructor/' + data.id).subscribe(res => {
            if (!res.status) {
                this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
                return;
            }
            this.entryForm.controls['id'].setValue(data.id);
            this.instructorList = res.data
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }
        );
    }

    getItem(row) {
        //this.getSubjectList();
        this.formTitle = 'Update Chapter';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(row.id);
        this.entryForm.controls['name_en'].setValue(row.chapter_name);
        this.entryForm.controls['course_id'].setValue(row.course_id);
        this.entryForm.controls['subject_id'].setValue(row.subject_id);
        this.entryForm.controls['is_active'].setValue(row.is_active);
    }

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

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }
        this.blockUI.start('Saving...');
        const obj = {
            id: this.entryForm.value.id ? this.entryForm.value.id : 0,
            name_en: this.entryForm.value.name_en.trim(),
            course_id: this.entryForm.value.course_id,
            subject_id: this.entryForm.value.subject_id,
            is_active: this.entryForm.value.is_active
        };
        const request = this._service.post('admin/chapter/save-or-update', obj);
        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.clearForm();
                    this.getList();
                    //this.getSubjectList();
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

    clearForm() {
        this.entryForm.reset();
        this.submitted = false;
        this.formTitle = 'Select Instructor';
        this.btnSaveText = 'Save';
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

    openModalCourse(template: TemplateRef<any>) {
        this.modalRefcourse = this.modalService.show(template, this.modalLgConfig);
    }

    modalHideCourse() {
        this.modalRefcourse.hide();
        this.courseForm.reset();
        this.submitted = false;

    }

    openModalStudent(template: TemplateRef<any>) {
        this.submitted = true;
        if (this.courseForm.invalid) {
            return;
        }
        this.projectId = this.courseForm.value.projectId;
        this.getStudentList();
        this.modalRefcourse.hide();
        this.modalRefStudent = this.modalService.show(template, this.modalLgConfig);
    }

    modalHideStudent(template: TemplateRef<any>) {
        this.modalRefStudent.hide();
        this.modalRefcourse = this.modalService.show(template, this.modalLgConfig);
        //this.modalRefcourse.hide();
        this.submitted = false;
    }


    checkUncheckAll() {
        if (this.selectedStudentIds.length < this.studentList.length) {
            this.selectedStudentIds = [];
            this.studentList.forEach(x => {
                this.selectedStudentIds.push(x.id);
                this.selectedStudentList.push(x);
            });

        } else {
            this.selectedStudentIds = [];
            this.selectedStudentList = [];
        }
    }

    checkStudentInSelectedList(id) {
        return this.selectedStudentIds.includes(id);
    }

    checkIndividually(item) {
        if (this.selectedStudentIds.includes(item.id)) {
            let index = this.selectedStudentIds.indexOf(item.id);
            this.selectedStudentIds.splice(index, 1);
            this.selectedStudentList.splice(index, 1);
        } else {
            this.selectedStudentIds.push(item.id);
            this.selectedStudentList.push(item);

        }
    }
    clearStudentChecks() {
        this.studentList = [];
        this.selectedStudentIds = [];
        this.selectedStudentList = [];
    }

    onWrittenFormSubmit() {
        this.submitted = true;
        if (this.courseForm.invalid) {
            return;
        }

        this.blockUI.start('Saving...');

        let selectedStudents = this.selectedStudentList.map(x => x.id);
        const obj = {
            course_name: this.courseForm.value.name.trim(),
            project_id: this.courseForm.value.projectId,
            title: this.courseForm.value.title,
            total_mark: this.courseForm.value.mark,
            type: this.courseForm.value.typeId,
            user_id: this.currentUser.id,
            description: this.courseForm.value.description ? this.courseForm.value.description.trim() : this.courseForm.value.description,
            deadline: this.courseForm.value.date ? moment(this.courseForm.value.date).format('YYYY-MM-DD') : null,
            assigned_student_ids: selectedStudents
        };

        const request = this._service.post('create-correction-service-question', obj);

        request.subscribe(
            data => {
                this.submitted = false;
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.clearStudentChecks();
                    this.modalRefStudent.hide();
                    this.modalRefcourse.hide();
                    this.courseForm.reset();
                    this.getList();
                } else {
                    this.toastr.warning(data.message, 'Warning!', { closeButton: true, disableTimeOut: false });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );

    }
}
