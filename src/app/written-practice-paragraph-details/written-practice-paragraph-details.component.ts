import { Component, ViewEncapsulation, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from '../_models/page';
import { CommonService } from '../_services/common.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '.././_services/authentication.service';
import { Editor, Toolbar } from "ngx-editor";

@Component({
  selector: "app-written-practice-paragraph-details",
  templateUrl: "./written-practice-paragraph-details.component.html",
  styleUrls: ["./written-practice-paragraph-details.component.css"],
  encapsulation: ViewEncapsulation.None,
})

export class WrittenPracticeParagraghDetailsComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  currentUser: any;
  id: any;
  detail = null;
  answer = null;
  correction = null;
  feedback = null;
  imageSource = null;

  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  modalRefImage: BsModalRef;

  editor: Editor;
  toolbar: Toolbar = [
    [ "strike"],
    ["text_color"],
  ];

  constructor(private route: ActivatedRoute,
    private _service: CommonService,
    private _authService: AuthenticationService,
    private modalService: BsModalService,
    private toastr: ToastrService) {
    this.id = this.route.snapshot.paramMap.get("id");
    this._authService.currentUserDetails.subscribe((value) => {
      this.currentUser = value;
    });
  }

  ngOnInit() {
    this.editor = new Editor();
    this.getList()
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  getList() {

    this.blockUI.start("Getting Infromations...");
    this._service.get("/get-written-practise-paragraph-details/" + this.id).subscribe(
      (res) => {
        this.blockUI.stop();
        // res.list.forEach(element => {
        //   this.correctionList.push(element)
        // });
        this.detail = {
          name: res.student_name + " (STUDENT)",
          phone: res.student_mobile_no,
          image: res.student_profile_pic,
          courseName: res.course_name,
          totalMark: res.total_mark,
          tutorName: res.tutor_name,
          title: res.title,
          description: res.description,
          createdDate: res.created_at,
          status: res.status_id,
          files: res.files
        };

        this.answer = res.details[0];
        this.correction = res.details[1];

      },
      (err) => {
        this.blockUI.stop();
      }
    );
  }

  OpenFeedbackModel(template: TemplateRef<any>) {
    //this.feedback=feedback;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  closeFeedbackModel() {
    this.modalRef.hide();
  }

  onFeedbackSubmit() {
    const obj = {
      id: this.correction.id,
      tutor_feedback: this.correction.tutor_feedback,
      user_id: this.currentUser.id,
    }

    this.blockUI.start('Saving data...');
    this._service.post('/update-feedback-by-admin', obj).subscribe(
      res => {
        this.blockUI.stop();
        this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
        this.closeFeedbackModel();
        this.getList();
      },
      error => {
        this.blockUI.stop();
      }
    );
  }

  OpenNoteModel(template: TemplateRef<any>) {
    //this.feedback=feedback;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  closeNoteModel() {
    this.modalRef.hide();
  }

  onNoteSubmit() {
    const obj = {
      id: this.correction.id,
      correction_note: this.correction.correction_note,
      user_id: this.currentUser.id,
    }

    this.blockUI.start('Saving data...');
    this._service.post('/update-correction-note-by-admin', obj).subscribe(
      res => {
        this.blockUI.stop();
        this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
        this.closeFeedbackModel();
        this.getList();
      },
      error => {
        this.blockUI.stop();
      }
    );
  }

  modalHideImage() {
    this.modalRefImage.hide();
  }

  openModalImage(template: TemplateRef<any>, src) {
    this.imageSource = src;
    this.modalRefImage = this.modalService.show(template, this.modalConfig);
  }

}
