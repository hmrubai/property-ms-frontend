import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from './../_services/authentication.service';
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
    selector: 'app-recruitment-exam-result',
    templateUrl: './recruitment-exam-result.component.html',
    styleUrls: ['./recruitment-exam-result.component.scss']
})
export class RecruitmentExamResultComponent implements OnInit {

    public currentUser: any;
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

    recruit_exam_id;
    paidCourseTest;
    examDetails;
    writtenAnswerDetails;


    file: File;
    arrayBuffer: any;
    filelist: any;

    importedData:any;
    dataImported = false;

    questionList: Array<any> = [];
    writtenQuestionList: Array<any> = [];
    resultList: Array<any> = [];

    urls = [];
    files = [];

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
        private confirmService: ConfirmService,
        private authService: AuthenticationService,
    ) {
        this.authService.currentUserDetails.subscribe((value) => {
            this.currentUser = value;
        });
        this.page.pageNumber = 0;
        this.page.size = 50;
        this.recruit_exam_id = this.route.snapshot.paramMap.get("exam_id");
    }

    ngOnInit() {

        if(!this.recruit_exam_id){
            this.toastr.error('Please, select exam first!', 'Select Exam!', { timeOut: 3000 });
            this.location.back();
        }

        this.rqForm = this.formBuilder.group({
            id: [null],
            mcq_quota: [50, [Validators.required, Validators.maxLength(250)]],
            written_quota: [150, [Validators.required, Validators.maxLength(250)]]
        });

        this.getResultList();
        this.getExamDetails();
    }

    get f() {
        return this.questionForm.controls;
    }

    get rf() {
        return this.rqForm.controls;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
    }

    getResultList(){
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('admin/getRecruitResultById/' + this.recruit_exam_id).subscribe(res => {
            this.resultList = res.data;
            this.page.totalElements = res.data.length;
            this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    getExamDetails(){
        this._service.get('admin/getRecruitExamDetailsByID/' + this.recruit_exam_id).subscribe(res => {
            this.examDetails = res.data;
            this.is_loaded = true;
        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    modalHide() {
        this.rqForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Update Quota';
        this.btnSaveText = 'Update';
    }

    viewWrittenAnswer(exam, template: TemplateRef<any>){
        this._service.get('admin/viewWrittenAnswerByID/' + exam.tutor_id + '/' + this.recruit_exam_id).subscribe(res => {
            if(res.status){
                this.writtenAnswerDetails = res.data;
                this.modalTitle = 'Written answer details';
                this.btnSaveText = 'Update';
                this.openEditModal(template);
            }else{
                this.toastr.error(res.message, 'Attention!', { timeOut: 4000 });
            }


        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    editQuota(item, template: TemplateRef<any>){
        this.modalTitle = 'Update quota';
        this.btnSaveText = 'Update';
        this.rqForm.controls['id'].setValue(item.id);
        this.rqForm.controls['mcq_quota'].setValue(item.mcq_quota);
        this.rqForm.controls['written_quota'].setValue(item.written_quota);

        this.openEditModal(template);
    }

    openEditModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Upload Questions using XLSX';
        this.btnSaveText = 'Upload';
        this.modalRef = this.modalService.show(template, this.modalSmConfig);
    }

    filterList() {
        this.rows = [];
        this.page.pageNumber = 0;
    }

    backToLocation() {
        this.location.back();
    }
}
