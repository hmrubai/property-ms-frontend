import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../_models/page';
import { CommonService } from '../_services/common.service';
import { debounceTime } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment } from '../../environments/environment'
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-recruitment-exam-written-questions',
    templateUrl: './recruitment-exam-written-questions.component.html',
    styleUrls: ['./recruitment-exam-written-questions.component.scss']
})
export class RecruitmentExamWrittenQuestionsComponent implements OnInit {

    id: string;
    isEdit: boolean;
    ColumnMode = ColumnMode;
    isCollapsed: boolean = true;
    modalTitle = 'Add Written Question';
    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    btnSaveText = 'Save';
    loadingIndicator = false;
    filterForm: FormGroup;
    questionForm: FormGroup;
    rqForm: FormGroup;
    uploadForm: FormGroup;

    is_loaded = false;

    page = new Page();
    rows = [];
    filteredData = [];

    written_exam_id;
    paidCourseTest;


    file: File;
    arrayBuffer: any;
    filelist: any;

    importedData:any;
    dataImported = false;

    schoolList: Array<any> = [];
    classList: Array<any> = [];
    questionList: Array<any> = [];
    writtenQuestionList: Array<any> = [];

    urls = [];
    files = [];

    genderList = ["Male", "Female", "Others"];
    questionType = [
        {
            id: "Short",
            name: "Short"
        },
        {
            id: "Descriptive",
            name: "Descriptive"
        },
        {
            id: "Paragraph",
            name: "Paragraph"
        }
    ]
    selectedGender: any;

    modalLgConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalSmConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalRef: BsModalRef;
    baseUrl = environment.baseUrl;
    @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private confirmService: ConfirmService
    ) {

        this.page.pageNumber = 0;
        this.page.size = 50;
        this.written_exam_id = this.route.snapshot.paramMap.get("exam_id");
    }

    ngOnInit() {

        if(!this.written_exam_id){
            this.toastr.error('Please, select exam first!', 'Select Exam!', { timeOut: 3000 });
            this.location.back();
        }

        this.filterForm = this.formBuilder.group({
            query: [null],
            gender: [null],
            tab: [null],
            class: [null],
            school: [null],
        });

        this.questionForm = this.formBuilder.group({
            id: [null],
            question: [null, [Validators.required, Validators.maxLength(250)]],
            option1: [null, [Validators.required, Validators.maxLength(250)]],
            option2: [null, [Validators.required, Validators.maxLength(250)]],
            option3: [null, [Validators.required, Validators.maxLength(250)]],
            option4: [null, [Validators.required, Validators.maxLength(250)]],
            option5: [null],
            option6: [null],
            correct_answer: [false],
            correct_answer2: [false],
            correct_answer3: [false],
            correct_answer4: [false],
            correct_answer5: [false],
            correct_answer6: [false],
            explanation_text: [null],
        });

        this.rqForm = this.formBuilder.group({
            id: [null],
            recruit_written_exam_id: this.written_exam_id,
            question: [null, [Validators.required, Validators.maxLength(250)]],
            min_word_count: [50, [Validators.required, Validators.maxLength(250)]],
            max_word_count: [150, [Validators.required, Validators.maxLength(250)]]
        });
        
        this.uploadForm = this.formBuilder.group({
            attachment: [''],
            total_marks: [null, [Validators.required, Validators.maxLength(250)]],
            no_of_questions: [null, [Validators.required, Validators.maxLength(250)]],
        });

        this.getQuestionList();
    }

    get f() {
        return this.questionForm.controls;
    }

    get uf() {
        return this.uploadForm.controls;
    }

    get rf() {
        return this.rqForm.controls;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    getQuestionList(){
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('admin/getRecruitWrittenExamQuestionsById/' + this.written_exam_id).subscribe(res => {
            this.writtenQuestionList = res.data;
            this.page.totalElements = res.data.length;
            this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    getPaidCourseTestDetails(){
        this._service.get('getPaidCourseTestDetailsByID/' + this.written_exam_id).subscribe(res => {
            this.paidCourseTest = res.result;
            this.is_loaded = true;
        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    deleteQuestion(item){
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?.')
        .subscribe(
            result => {
                if (result) {
                    this._service.post('admin/deleteRecruitExamQuestion', { id : item.id }).subscribe(
                        data => {
                            this.blockUI.stop();
                            this.toastr.success(data.message, 'Success', { timeOut: 2000 });
                            this.getQuestionList();
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
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
                this.uploadForm.get('attachment').setValue(this.files);
                //this.submitImage();
            }
        }
    }

    submitAttachment() 
    {
        const formData = new FormData();
        formData.append('paid_course_material_id', this.written_exam_id);
        formData.append('total_marks', this.uploadForm.value.total_marks);
        formData.append('no_of_questions', this.uploadForm.value.no_of_questions);
        formData.append('attachment', this.uploadForm.get('attachment').value);

        this.blockUI.start('Uploading File...');
        this._service.post('paid-course/attachment-upload', formData).subscribe(
            res => {
                this.blockUI.stop();
                if (!res.status) {
                    this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true, enableHtml: true });
                    return;
                }
                this.modalHide();
                this.getQuestionList();
                this.toastr.success(res.message, 'Success!', { timeOut: 3000 });
                this.urls = [];
                this.files = [];
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true, enableHtml: true });
            }
        );
    }

    getList() {
        this.loadingIndicator = true;
        const obj = {
            size: this.page.size,
            pageNumber: this.page.pageNumber,
            searchText: this.filterForm.value.query ? this.filterForm.value.query.trim() : "",
            gender: this.filterForm.value.gender ?? null,
            tab: this.filterForm.value.tab ?? null,
            schoolId: this.filterForm.value.school,
            classId: this.filterForm.value.class,
        };

        this._service.get('Learner/GetLearnerListWithPagination', obj).subscribe(res => {
            this.loadingIndicator = false;
            if (res.Status === 2) {
                this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                return;
            }
            else if (res.Status === 1) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.rows = res.Data.List;
            this.page.totalElements = res.Data.TotalRows;
            this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
            setTimeout(() => {
                this.loadingIndicator = false;
                this.tableComponent.recalculate();
            }, 1000);
        }, err => {
            this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        });
    }

    modalHide() {
        this.rqForm.reset();
        this.questionForm.reset();
        this.uploadForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Upload Questions using XLSX';
        this.btnSaveText = 'Upload';
    }

    editQuestion(item, template: TemplateRef<any>){
        this.modalTitle = 'Update Questions';
        this.btnSaveText = 'Update';
        this.questionForm.controls['id'].setValue(item.id);
        this.questionForm.controls['question'].setValue(item.question);
        this.questionForm.controls['option1'].setValue(item.option1);
        this.questionForm.controls['option2'].setValue(item.option2);
        this.questionForm.controls['option3'].setValue(item.option3);
        this.questionForm.controls['option4'].setValue(item.option4);
        this.questionForm.controls['option5'].setValue(item.option5);
        this.questionForm.controls['option6'].setValue(item.option6);
        this.questionForm.controls['correct_answer'].setValue(item.correct_answer ? true : false);
        this.questionForm.controls['correct_answer2'].setValue(item.correct_answer2 ? true : false);
        this.questionForm.controls['correct_answer3'].setValue(item.correct_answer3 ? true : false);
        this.questionForm.controls['correct_answer4'].setValue(item.correct_answer4 ? true : false);
        this.questionForm.controls['correct_answer5'].setValue(item.correct_answer5 ? true : false);
        this.questionForm.controls['correct_answer6'].setValue(item.correct_answer6 ? true : false);
        this.questionForm.controls['explanation_text'].setValue(item.explanation_text);

        this.openEditModal(template);
    }

    editWrittenQuestion(item, template: TemplateRef<any>){
        this.modalTitle = 'Update Question';
        this.btnSaveText = 'Update';
        this.rqForm.controls['id'].setValue(item.id);
        this.rqForm.controls['question'].setValue(item.question);
        this.rqForm.controls['min_word_count'].setValue(item.min_word_count);
        this.rqForm.controls['max_word_count'].setValue(item.max_word_count);

        this.openEditModal(template);
    }

    openAddQuestionModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add New Question';
        this.btnSaveText = 'Save';
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    openAddWrittenQuestionModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add Written Exam Question';
        this.btnSaveText = 'Save';
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    openEditModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Upload Questions using XLSX';
        this.btnSaveText = 'Upload';
        this.modalRef = this.modalService.show(template, this.modalSmConfig);
    }

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

    onUpdateQuestionFormSubmit(){
        this.submitted = true;
        if (this.questionForm.invalid) {
            return;
        }

        let question = {
            id: this.questionForm.value.id,
            question: this.questionForm.value.question,
            option1: this.questionForm.value.option1,
            option2: this.questionForm.value.option2,
            option3: this.questionForm.value.option3,
            option4: this.questionForm.value.option4,
            option5: this.questionForm.value.option5,
            option6: this.questionForm.value.option6,
            correct_answer: this.questionForm.value.correct_answer ? 1 : null,
            correct_answer2: this.questionForm.value.correct_answer2 ? 2 : null,
            correct_answer3: this.questionForm.value.correct_answer3 ? 3 : null,
            correct_answer4: this.questionForm.value.correct_answer4 ? 4 : null,
            correct_answer5: this.questionForm.value.correct_answer5 ? 5 : null,
            correct_answer6: this.questionForm.value.correct_answer6 ? 6 : null,
            explanation_text: this.questionForm.value.explanation_text,
        }

        this.blockUI.start('Updating data. Please wait...');
        this._service.post('admin/updateRecruitExamQuestion', question).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getQuestionList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onAddQuestionFormSubmit(){
        this.submitted = true;
        if (this.questionForm.invalid) {
            return;
        }

        let question = {
            question: this.questionForm.value.question,
            option1: this.questionForm.value.option1,
            option2: this.questionForm.value.option2,
            option3: this.questionForm.value.option3,
            option4: this.questionForm.value.option4,
            option5: this.questionForm.value.option5,
            option6: this.questionForm.value.option6,
            correct_answer: this.questionForm.value.correct_answer ? 1 : null,
            correct_answer2: this.questionForm.value.correct_answer2 ? 2 : null,
            correct_answer3: this.questionForm.value.correct_answer3 ? 3 : null,
            correct_answer4: this.questionForm.value.correct_answer4 ? 4 : null,
            correct_answer5: this.questionForm.value.correct_answer5 ? 5 : null,
            correct_answer6: this.questionForm.value.correct_answer6 ? 6 : null,
            explanation_text: this.questionForm.value.explanation_text,
        }

        this.blockUI.start('Adding Exam. Please wait...');
        this._service.post('admin/addRecruitExamQuestion', question).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getQuestionList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onAddWrittenQuestionFormSubmit(){
        this.rqForm.controls['recruit_written_exam_id'].setValue(this.written_exam_id);
        this.submitted = true;
        if (this.rqForm.invalid) {
            return;
        }

        this.blockUI.start('Adding Question. Please wait...');
        this._service.post('admin/addUpdateRecruitWrittenExamQuestion', this.rqForm.value).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getQuestionList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    deleteWrittenQuestion(item){
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?.')
        .subscribe(
            result => {
                if (result) {
                    this._service.post('admin/deleteRecruitWrittenQuestion', { id : item.id }).subscribe(
                        data => {
                            if(data.status){
                                this.blockUI.stop();
                                this.toastr.success(data.message, 'Success', { timeOut: 2000 });
                                this.getQuestionList();
                            }else{
                                this.blockUI.stop();
                                this.toastr.error(data.message, 'Attention!', { timeOut: 2000 });
                            }
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
    }

    onFormSubmit(){
        let params = {
            paid_course_test_id : this.written_exam_id,
            questions: this.importedData
        }

        this._service.post('uploadSelectionTestQuestion', params).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getQuestionList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    resetFilterList() {
        this.filterForm.reset();
        this.getList();
    }

    filterList() {
        this.rows = [];
        this.page.pageNumber = 0
        this.getList()
    }

    backToLocation() {
        this.location.back();
    }
}
