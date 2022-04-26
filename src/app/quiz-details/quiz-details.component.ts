import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import {DomSanitizer} from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { Page } from '../_models/page';


@Component({
    selector: 'app-quiz-details',
    templateUrl: './quiz-details.component.html',
    styleUrls: ['./quiz-details.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class QuizDetailsComponent implements OnInit {

    baseUrl = environment.baseUrl;

    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    formTitle = 'Correction List';
    btnSaveText = 'Save';

    modalTitle = 'Add Correction';
    saveButtonText: string = 'Save';

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    emptyGuid = '00000000-0000-0000-0000-000000000000';
    rows = [];
    loadingIndicator = false;
    is_loaded = false;
    ColumnMode = ColumnMode;

    scrollBarHorizontal = (window.innerWidth < 1200);

    subjectList = [];
    courseList = [];
    instructorList = [];

    quizDetails;
    quizId;

    total_submited = 0;

    userImage = '';

    constructor(
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private sanitizer:DomSanitizer,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: BsModalService,
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };

        this.quizId = this.route.snapshot.paramMap.get("id");
    }


    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            teacher_id: [null, [Validators.required]],
        });
        console.log(this.quizId);
        this.getDetails();
        //this.getCourseList();
        //this.getSubjectList();
    }

    get f() {
        return this.entryForm.controls;
    }

    setImageUrl(imageFile){
        let image = this.baseUrl + '/uploads/images/profile/'+ imageFile;
        this.sanitize(image);
        return image;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    getSubjectList() {
        this._service.get('admin/subject/get-list').subscribe(res => {
            this.subjectList = res.data;
        }, err => { }
        );
    }

    getSubjectListByCourse(item){
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
    }

    getDetails(){
        this._service.get('get-admission-exam-details-admin/'+ this.quizId).subscribe(res => {
            this.quizDetails = res;
            console.log(res)
            this.total_submited = res.students.length;
            this.is_loaded = true;
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

    secondsToDhms(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        
        var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    }

    getList() {
        this.loadingIndicator = true;
        let params = {
            fromDate: null,
            pageNumber: 0,
            pageSize: 10,
            projectId: 4,
            status_id: null,
            student_name: null,
            toDate: null,
            tutor_name: null,
            type: null
        }

        this._service.post('search-written-practice-correction-paginated-list', params).subscribe(res => {
            // if (!res.status) {
            //     this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
            //     return;
            // }
            this.quizDetails = res.records;
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

    findInstructor(data, template: TemplateRef<any>){
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
        this.getSubjectList();
        this.formTitle = 'Update Chapter';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(row.id);
        this.entryForm.controls['name_en'].setValue(row.chapter_name);
        this.entryForm.controls['course_id'].setValue(row.course_id);
        this.entryForm.controls['subject_id'].setValue(row.subject_id);
        this.entryForm.controls['is_active'].setValue(row.is_active);
    }

    onSetInstructorSubmit(){
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
                    this.getSubjectList();
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

    sanitize(url:string){
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
