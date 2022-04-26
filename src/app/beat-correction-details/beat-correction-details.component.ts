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
import { AuthenticationService } from '../_services/authentication.service';
// import { Editor, Toolbar } from "ngx-editor";


@Component({
    selector: 'app-beat-correction-details',
    templateUrl: './beat-correction-details.component.html',
    styleUrls: ['./beat-correction-details.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BEATCorrectionDetailsComponent implements OnInit {
    currentUser: any = null;
    baseUrl = environment.baseUrl;

    entryForm: FormGroup;
    correctionForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    formTitle = 'Correction List';
    btnSaveText = 'Save';

    // editor: Editor;
    // toolbar: Toolbar = [
    //     [ "strike"],
    //     ["text_color"],
    // ];


    modules = {
        syntax: false,
        toolbar: [['strike'], [{ color: ['black', 'red'] }]],
    };

    correction_note = '';
    tutor_feedback = '';

    modalTitle = 'Add Correction';
    saveButtonText: string = 'Save';

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
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

    correctionDetails;
    correctionId;

    userImage = '';

    constructor(
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private sanitizer:DomSanitizer,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private _authService: AuthenticationService,
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

        this.correctionId = this.route.snapshot.paramMap.get("correction_id");
    }


    ngOnInit() {
        //this.editor = new Editor();
        this.entryForm = this.formBuilder.group({
            id: [null],
            teacher_id: [null, [Validators.required]],
        });

        this.correctionForm = this.formBuilder.group({
            id: [null, [Validators.required]],
            admin_id: [null, [Validators.required]],
            total_mark: [null, [Validators.required]],
            mark: [null, [Validators.required]],
            tutor_correction: [null, [Validators.required]],
            tutor_feedback: [null, [Validators.required]],
        });

        this.correctionForm.controls['admin_id'].setValue(this.currentUser.id);

        // console.log(this.currentUser)
        // console.log(this.correctionId);
        this.getDetails();
        //this.getCourseList();
        //this.getSubjectList();
    }

    get f() {
        return this.entryForm.controls;
    }

    get cf() {
        return this.correctionForm.controls;
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
        this.blockUI.start('Loading...');
        this._service.get('admin/beat/answer-details-by-id/'+ this.correctionId).subscribe(res => {
            this.blockUI.stop();
            this.correctionDetails = res.result;
            this.is_loaded = true;
            this.blockUI.stop();
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            this.blockUI.stop();
        }
        );
    }

    transform(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
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
            this.correctionDetails = res.records;
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

    editCFNote(answer, template: TemplateRef<any>){
        console.log(answer)
        this.modalTitle = 'Update Note';
        this.saveButtonText = 'Update';
        this.correctionForm.controls['id'].setValue(answer.id);
        // this.correction_note = answer.tutor_correction;
        // this.tutor_feedback = answer.tutor_feedback;
        
        this.correctionForm.controls['total_mark'].setValue(answer.total_mark);
        this.correctionForm.controls['mark'].setValue(answer.given_mark);
        this.correctionForm.controls['tutor_correction'].setValue(answer.tutor_correction);
        this.correctionForm.controls['tutor_feedback'].setValue(answer.tutor_feedback);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    onCorrectionNoteSubmit(){
        this.submitted = true;
        if (this.correctionForm.invalid) {
            return;
        }

        if(this.correctionForm.value.mark < 0){
            this.toastr.error("Please, enter correct mark", 'Error!', { closeButton: true, disableTimeOut: true });
            return;
        }

        if(this.correctionForm.value.mark > this.correctionForm.value.total_mark){
            this.toastr.error("Please, enter correct mark", 'Error!', { closeButton: true, disableTimeOut: true });
            return;
        }

        this.blockUI.start('Saving...');

        const request = this._service.post('admin/beat/submit-admin-feedback', this.correctionForm.value);
        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.status == 'Ok') {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    //this.clearForm();
                    this.modalHide();
                    this.getDetails();
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
        //this.entryForm.reset();
        this.modalRef.hide();
        this.submitted = false;
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Upload subject using xlsx';
        this.saveButtonText = 'Upload';
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }
}
