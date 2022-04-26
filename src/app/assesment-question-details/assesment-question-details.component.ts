import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { MustMatch } from '../_helpers/must-match.validator';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-assesment-question-details',
    templateUrl: './assesment-question-details.component.html',
    styleUrls: ['./assesment-question-details.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AssesmentQuestionDetailsComponent implements OnInit {
    baseUrl = environment.baseUrl;
    isCollapsed = false;
    is_loaded = false;
    entryForm: FormGroup;
    submitted = false;
    is_update = false;
    modalTitle = 'Add Student';
    isUpdate = false;
    saveButtonText: string = 'Save';
    updateButtonText: string = 'Update';
    @BlockUI() blockUI: NgBlockUI;

    assesmentId;
    examId;

    importedDate:any;
    dataImported = false;
    file: File;
    arrayBuffer: any;
    filelist: any;

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];

    page = new Page();

    projectDetails = [];
    assesmentDetails:any;

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.assesmentId = this.route.snapshot.paramMap.get("assesmentId");
    }

    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            assessment_subject_id: [null],
            questions: [null, [Validators.required]],
            option1: [null, [Validators.required]],
            option2: [null, [Validators.required]],
            option3: [null, [Validators.required]],
            option4: [null, [Validators.required]],
            answer: [null, [Validators.required]],
        });

        this.getList();
    }

    get f() {
        return this.entryForm.controls;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }


    getList() {
        this.loadingIndicator = true;
        this._service.get('getAssesmentSubjectWithQuestion/' + this.assesmentId).subscribe(res => {
            this.assesmentDetails = res;
            this.is_loaded = true;
            //this.page.totalElements = res.total_number;
            this.loadingIndicator = false;
        }, err => {
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            this.loadingIndicator = false;
        }
        );
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving data...');

        this._service.post('add-assesment-question-list', [this.entryForm.value]).subscribe(
            res => {
                this.blockUI.stop();
                this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                this.modalHide();
                this.getList();
            },
            error => {
                this.blockUI.stop();
            }
        );
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
            this.importedDate = XLSX.utils.sheet_to_json(worksheet, { raw: true });
            this.dataImported = true;
            this.filelist = [];
            this.importedDate.forEach(element => {
                element.assessment_subject_id = this.assesmentId;
                element.answer = element.correct_answer;
                element.questions = element.question;
                delete element.correct_answer;
                delete element.question;
                delete element.explanation_text;
            });
            console.log(this.importedDate)
        }
    }

    uploadFileSubmit() {
        if(this.importedDate){
            this.blockUI.start('Saving data...');
            this._service.post('add-assesment-question-list', [this.importedDate]).subscribe(
                res => {
                    this.blockUI.stop();
                    this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getList();
                    this.importedDate = null;
                },
                error => {
                    this.blockUI.stop();
                }
            );
        }else{
            this.toastr.warning('Please, Select file!', 'Attention!', { timeOut: 2000 });
        }
        
    }

    DeleteQuestion(question){
        console.log(question);
    }

    backTo() {
        this.location.back();
    }

    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.isUpdate = false;
        this.submitted = false;
        this.modalTitle = 'Add Student';
        this.saveButtonText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add Question';
        this.saveButtonText = 'Save';
        this.entryForm.controls['assessment_subject_id'].setValue(this.assesmentId);
        this.is_update = false;
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    openUploadModal(template: TemplateRef<any>) {
        this.modalTitle = 'Upload questions via Xlsx';
        this.saveButtonText = 'Upload';
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    openUpdateModal(question, template: TemplateRef<any>) {
        this.is_update = true;
        this.modalTitle = 'Update Question';
        this.updateButtonText = "Update"
        this.entryForm.controls['id'].setValue(question.id);
        this.entryForm.controls['assessment_subject_id'].setValue(this.assesmentId);
        this.entryForm.controls['questions'].setValue(question.questions);
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

        this.blockUI.start('Updating data...');

        this._service.post('update-assesment-question', this.entryForm.value).subscribe(
            res => {
                this.blockUI.stop();
                this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                this.modalHide();
                this.getList();
            },
            error => {
                this.blockUI.stop();
            }
        );
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
}
