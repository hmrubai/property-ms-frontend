import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from './../_models/page';
import { AuthenticationService } from './../_services/authentication.service';
import { MustMatch } from './../_helpers/must-match.validator';
import * as moment from 'moment';

@Component({
    selector: 'app-entrance-quiz-details',
    templateUrl: './entrance-quiz-details.component.html',
    styleUrls: ['./entrance-quiz-details.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class EntranceQuizDetailsComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    modalTitle = 'Add Question';
    isUpdate = false;
    saveButtonText: string = 'Save';
    updateButtonText: string = 'Update';
    @BlockUI() blockUI: NgBlockUI;

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];
    bsConfig: Partial<BsDatepickerConfig>;

    page = new Page();

    is_update = false;

    filterDate = new Date();

    first_loaded = true;

    summaryList;
    projectList = [];
    studentList = [];
    assesmentList = [];
    selectedStudentList = [];
    tutorList = [];
    is_tutor_selected = false;
    tutorDetails;
    participantDetails;

    allVirtualClassList = [];
    virtualClassList = [];
    history:any;

    is_all_shown = false;
    
    detailsId;

    quizDetails;
    questionlist = [];
    historyDetails = [];

    projectId;

    search_tutor;
    search_student;

    isSummary = false;

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private confirmService: ConfirmService,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
    ) {
        this.page.pageNumber = 1;
        this.page.size = 9;

        this.detailsId = this.route.snapshot.paramMap.get("id");
    }


    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            title: [null, [Validators.required]],
            option1: [null, [Validators.required]],
            option2: [null, [Validators.required]],
            option3: [null, [Validators.required]],
            option4: [null, [Validators.required]],
            answer: [null, [Validators.required]],
        });

        this.bsConfig = Object.assign({}, {
            dateInputFormat: 'DD-MMM-YYYY '
        });

        if(this.detailsId){
            this.getDetails();
        }
    }

    get f() {
        return this.entryForm.controls;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getStudentList();
    }

    getDetails(){
        this.loadingIndicator = true;
        this._service.get('getExamDetails/' + this.detailsId).subscribe(res => {
            this.quizDetails = res;
            this.getQuestionDetails();
            this.loadingIndicator = false;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            this.loadingIndicator = false;
        }
        );
    }

    getQuestionDetails(){
        this.loadingIndicator = true;
        this._service.get('getQuestionListBySetId/' + this.detailsId + '/' + this.page.size + '/' + this.page.pageNumber).subscribe(res => {
            this.questionlist = res.records;
            this.loadingIndicator = false;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            this.loadingIndicator = false;
        }
        );
    }

    SearchTutor(){
        let params = {
            date: moment(this.filterDate).format('DD-MMM-YYYY'),
            search: this.search_tutor
        }

        this.allVirtualClassList = [];
        this.virtualClassList = [];
        this._service.post('getMeetingsByDateByProjectId/2', params).subscribe(res => {
            this.allVirtualClassList = res;
            this.allVirtualClassList.forEach(element => {
                if(element.participants.length){
                    this.virtualClassList.push(element); 
                }
            });
            this.is_all_shown = false;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        });

    }

    showAll(){
        this.virtualClassList = [];
        this.allVirtualClassList.forEach(element => {
            this.virtualClassList.push(element);
        });
        this.is_all_shown = true;
    }

    hideUnsuccessFull(){
        this.virtualClassList = [];
        this.allVirtualClassList.forEach(element => {
            if(element.participants.length){
                this.virtualClassList.push(element); 
            }
        });
        this.is_all_shown = false;
    }


    getList() {
        this.loadingIndicator = true;
        this._service.get('get-mini-dashboard-info-admin').subscribe(res => {
            this.summaryList = res;
            this.isSummary = true;
            this.loadingIndicator = false;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            this.loadingIndicator = false;
        }
        );
    }

    getProjectListAdmin(){
        this.loadingIndicator = true;
        this._service.get('getProjectListAdmin').subscribe(res => {
            this.projectList = res;
            this.loadingIndicator = false;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            this.loadingIndicator = false;
        }
        );
    }

    getStudentList(){
        this.loadingIndicator = true;
        this._service.get('student/getAllWithPagination/' + this.page.size + '/'+(this.page.pageNumber+1)).subscribe(res => {
            this.studentList = res.records;
            this.studentList.forEach((item, index) =>{
                item.is_selected = false;

                this.selectedStudentList.forEach((row, index) =>{
                    if(item.id == row.id){
                        item.is_selected = true;
                    }
                });
            });

            this.page.totalElements = res.total_number;
            this.loadingIndicator = false;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        }
        );
    }

    selectStudent(student){
        this.selectedStudentList.push(student);
        this.studentList.forEach((item, index) =>{
            if(item.id == student.id){
                item.is_selected = true;
            }
        });
        console.log(this.selectedStudentList);
    }
    
    removeStudent(student){
        this.studentList.forEach((item, index) =>{
            if(item.id == student.id){
                item.is_selected = false;
            }
        });

        let item_index = null;
        this.selectedStudentList.forEach((element, index) =>{
            if(element.id == student.id){
                item_index = index;
            }
        });
        this.selectedStudentList.splice(item_index, 1);
        console.log(this.selectedStudentList);
    }

    changeProject(project){
        if(project){
            this.projectId = project.id;
            this.assesmentList = project.assesments;
            this.first_loaded = false;
        }else{
            this.assesmentList = [];
            this.first_loaded = true; 
            this.projectId = null;
            this.is_tutor_selected = false;
            this.tutorDetails = null;
            this.tutorList = [];
            this.search_tutor = null;
        }
    }

    GetTutorList(){
        let params = {
            project_id: this.projectId,
            searchItem: this.search_tutor
        }
        this._service.post('search-tutor-for-virtual-class', params).subscribe(res => {
            this.tutorList = res;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
           
        }
        );
    }

    GetStudentList(){
        let param = {
            search: this.search_student
        };
        this._service.post('searchStudent', param).subscribe(res => {
            this.studentList = res.result;
            this.studentList.forEach((item, index) =>{
                item.is_selected = false;

                this.selectedStudentList.forEach((row, index) =>{
                    if(item.id == row.id){
                        item.is_selected = true;
                    }
                });
            });
            this.page.totalElements = res.result.length;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        }
        );
    }

    EditTutorSecret(tutor, template: TemplateRef<any>) {
        this.modalTitle = tutor.name;
        this.entryForm.controls['zoom_id'].setValue(tutor.zoom_id);
        this.entryForm.controls['zoom_password'].setValue(tutor.zoom_password);
        this.entryForm.controls['zoom_api_key'].setValue(tutor.z_api_key);
        this.entryForm.controls['zoom_api_secret'].setValue(tutor.z_api_secret);
        this.entryForm.controls['zoom_token'].setValue(tutor.z_token);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    SubmitStudent(){
        let students = [];
        this.selectedStudentList.forEach((row, index) =>{
            students.push(row.id);
        });

        let params = {
            project_id: this.projectId,
            studentIds: students,
            tutor_id: this.tutorDetails.id
        }

        this.confirmService.confirm('Are you sure?', 'Do you want to add student?')
            .subscribe(
            result => {
                if (result) {
                    this.blockUI.start('Submitting Student...');
                    this._service.post('create-virtual-class-connection', params).subscribe(res => {
                        this.toastr.success(res.message, 'Successful!');
                        this.tutorDetails = res.result;
                        this.selectedStudentList = res.result.e_edu2_students;
                        this.blockUI.stop();
                    }, err => {
                        this.blockUI.stop();
                    });
                }
            }
            );
    }

    openUpdateModal(question, template: TemplateRef<any>) {
        this.is_update = true;
        this.modalTitle = 'Update Question';
        this.updateButtonText = "Update"
        this.entryForm.controls['id'].setValue(question.id);
        this.entryForm.controls['title'].setValue(question.title);
        this.entryForm.controls['option1'].setValue(question.option1);
        this.entryForm.controls['option2'].setValue(question.option2);
        this.entryForm.controls['option3'].setValue(question.option3);
        this.entryForm.controls['option4'].setValue(question.option4);
        this.entryForm.controls['answer'].setValue(question.answer.toString());

        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    SubmitQuestionUpdate(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Submitting data...');

        let params = {
            id: this.entryForm.value.id,
            master_course_id: this.quizDetails.master_course_id,
            class_id: this.quizDetails.class_id,
            exam_set_id: this.quizDetails.id,
            title: this.entryForm.value.title,
            option1: this.entryForm.value.option1,
            option2: this.entryForm.value.option2,
            option3: this.entryForm.value.option3,
            option4: this.entryForm.value.option4,
            answer: this.entryForm.value.answer
        }
        this._service.post('question-update', params).subscribe(
            res => {
                this.blockUI.stop();
                this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                this.modalHide();
                this.getDetails();
                this.getQuestionDetails();
            },
            error => {
                this.blockUI.stop();
            }
        );
    }

    selectTutor(tutor){
        this.is_tutor_selected = true;
        this.tutorDetails = tutor;
        this.selectedStudentList = tutor.e_edu2_students;
        this.studentList.forEach((item, index) =>{
            item.is_selected = false;
            this.selectedStudentList.forEach((row, index) =>{
                if(item.id == row.id){
                    item.is_selected = true;
                }
            });
        });
    }

    CancelTutor(){
        this.is_tutor_selected = false;
        this.tutorDetails = null;
        this.tutorList = [];
        this.search_tutor = null;
    }

    editTutor(){

    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Submitting data...');

        let params = {
            id: null,
            master_course_id: this.quizDetails.master_course_id,
            class_id: this.quizDetails.class_id,
            exam_set_id: this.quizDetails.id,
            title: this.entryForm.value.title,
            option1: this.entryForm.value.option1,
            option2: this.entryForm.value.option2,
            option3: this.entryForm.value.option3,
            option4: this.entryForm.value.option4,
            answer: this.entryForm.value.answer
        }
        this._service.post('multi-question', [params]).subscribe(
            res => {
                this.blockUI.stop();
                this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                this.modalHide();
                this.getDetails();
                this.getQuestionDetails();
            },
            error => {
                this.blockUI.stop();
            }
        );
    }

    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.is_update = false;
        this.isUpdate = false;
        this.submitted = false;
        this.modalTitle = 'Add Question';
        this.saveButtonText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.is_update = false;
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    getItem(id, template: TemplateRef<any>) {
        this.blockUI.start('Saving...');
        this._service.get('Account/GetUserById/' + id).subscribe(res => {
            this.blockUI.stop();
            if (!res.Success) {
                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.entryForm.controls['id'].setValue(res.Record.Id);
            this.entryForm.controls['FirstName'].setValue(res.Record.FirstName);
            this.entryForm.controls['LastName'].setValue(res.Record.LastName);
            this.entryForm.controls['Email'].setValue(res.Record.Email);
            this.entryForm.controls['IsActive'].setValue(res.Record.IsActive);
            this.entryForm.controls['Password'].setValue('********');
            this.entryForm.controls['ConfirmPassword'].setValue('********');

            this.modalTitle = 'Update User';
            this.saveButtonText = 'Update';
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
            this.blockUI.stop();
        }
        );
    }

    fixDate(d: Date): Date {
        d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
        return d;
    }
}
