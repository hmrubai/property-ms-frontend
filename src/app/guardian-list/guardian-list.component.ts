import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../environments/environment";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";
import { CommonService } from "../_services/common.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { MatDialog } from "@angular/material/dialog";
import { Page } from "../_models/page";
import { Editor, Toolbar } from "ngx-editor";
import * as XLSX from "xlsx";
import { BsDaterangepickerConfig } from "ngx-bootstrap/datepicker";
import * as moment from "moment";

@Component({
  selector: "app-guardian-list",
  templateUrl: "./guardian-list.component.html",
  styleUrls: ["./guardian-list.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class GuardianListComponent implements OnInit , OnDestroy {
  baseUrl = environment.baseUrl;

  entryForm: FormGroup;
  searchForm: FormGroup;
  emailForm: FormGroup;
  notificationForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  formTitle = "Guardian List";
  btnSaveText = "Save";

  modalTitle = "Add Guardian";
  saveButtonText: string = "Save";

  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalConfigLg: any = { class: 'gray modal-lg', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  emptyGuid = "00000000-0000-0000-0000-000000000000";
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = window.innerWidth < 1200;

  selectedGuardianIds = [];
  selectedTGuardiansList = [];
  selectedGuardiansListExcelData = [];

  guardianList = [];
  p: number = 1;
  userImage = "";
  bsConfig: Partial<BsDaterangepickerConfig>;
  bsValue: Date[] = [];

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

  bodyImage: any;
  notificationImage: any;
  attachmentfiles: any;

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1200;
    };

    this.bsConfig = Object.assign(
      {},
      {
        isAnimated: true,
        adaptivePosition: true,
        rangeInputFormat: "DD MMM YYYY",
        maxDate: new Date(),
      }
    );
  }

  ngOnInit() {
    // this.entryForm = this.formBuilder.group({
    //   id: [null],
    //   teacher_id: [null, [Validators.required]],
    // });
    this.editor = new Editor();
    this.searchForm = this.formBuilder.group({
      search_item: [null],
      is_submitted_coginitve: [false],
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
      notificationImage: [null]
  });
    this.getList();
    //this.getCourseList();
    //this.getSubjectList();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
}

  // get f() {
  //   return this.entryForm.controls;
  // }

  get e() {
    return this.emailForm.controls;
  }
  get n() {
      return this.notificationForm.controls;
  }

  setImageUrl(imageFile) {
    let image = this.baseUrl + "/uploads/images/profile/" + imageFile;
    this.sanitize(image);
    return image;
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

  getList() {
    this.blockUI.start("Getting Infromations...");
    this._service.get("guardian").subscribe(
      (res) => {
        this.blockUI.stop();
        this.guardianList = res;
      },
      (err) => {
        this.blockUI.stop();
      }
    );
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  checkGuardianInSelectedList(guardianId) {
    return this.selectedGuardianIds.includes(guardianId);
  }

  selectUnselectGuardian(e, guardian) {
    if (this.selectedGuardianIds.includes(guardian.id)) {
      this.selectedGuardianIds.splice(
        this.selectedGuardianIds.indexOf(guardian.id),
        1
      );
      this.selectedTGuardiansList.splice(
        this.selectedGuardianIds.indexOf(guardian.id),
        1
      );
    } else {
      this.selectedGuardianIds.push(guardian.id);
      this.selectedTGuardiansList.push(guardian);
    }
  }

  checkUncheckAll() {
    if (this.selectedGuardianIds.length < this.guardianList.length) {
      this.selectedGuardianIds = [];
      this.guardianList.forEach((guardian) => {
        this.selectedGuardianIds.push(guardian.id);
        this.selectedTGuardiansList.push(guardian);
      });
    } else {
      this.selectedGuardianIds = [];
      this.selectedTGuardiansList = [];
      this.selectedGuardiansListExcelData = [];
    }
  }

  getListByFilter() {
    this.guardianList = [];
    this.blockUI.start("Getting Infromations...");
    const obj = {
      from:
        this.bsValue.length > 0
          ? this.bsValue[0]
          : null,
      to:
        this.bsValue.length > 0
          ? this.bsValue[1]
          : null,
      is_submitted_coginitve: this.searchForm.value.is_submitted_coginitve,
      search: this.searchForm.value.search_item
        ? this.searchForm.value.search_item.trim()
        : null,
    };
    this._service.post("searchGuardian", obj).subscribe(
      (res) => {
        this.guardianList = res.records;
        this.blockUI.stop();
      },
      (err) => {
        this.blockUI.stop();
      }
    );
  }

  allClear() {
    // this.page.pageNumber = 0;
    // this.page.size = 9;
    this.p = 1;
    this.searchForm.reset();
    // this.getList();
  }

  checkAndSendEmail() {
    this.blockUI.start("Sending...");
    this._service.get("checkAndSendGuardianEmail").subscribe(
      (res) => {
        this.blockUI.stop();
        if (res.status == "Ok") {
          this.toastr.success(res.message, "Success!", { timeOut: 2000 });
        } else {
          this.toastr.error(res.message, "Error!", {
            closeButton: true,
            disableTimeOut: true,
          });
        }
      },
      (err) => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, "Error!", {
          closeButton: true,
          disableTimeOut: true,
        });
      }
    );
  }



  openEmailModal(template: TemplateRef<any>) {
    // this.editor = new Editor();
    this.emailForm.controls['email_body'].setValue('');
     this.modalRef = this.modalService.show(template, this.modalConfigLg);
 }
 openNotificationModal(template: TemplateRef<any>) {
    // this.editor = new Editor();
     this.modalRef = this.modalService.show(template, this.modalConfigLg);
 }




 sendNotification() {


      this.submitted = true;
      if (this.notificationForm.invalid) {
          return;
      }

      if (this.selectedGuardianIds.length == 0) {
          this.toastr.error("No Guardian Selected", 'Error!', { closeButton: true, disableTimeOut: true });
          return;
      }

      this.blockUI.start('Sending...');
      let formData = new FormData();

      let data = {
          ids: this.selectedGuardianIds,
          title: this.notificationForm.value.title.trim(),
          message: this.notificationForm.value.body.trim()
      };
      if (this.notificationImage) {
        formData.append("thumbnail", this.notificationImage)
    }
      formData.append("data", JSON.stringify(data));
      const request = this._service.post('send-guardians-message', formData);
      request.subscribe(
          data => {
              this.blockUI.stop();
              if (data.status == 'Ok') {
                  this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                  this.hideNotificationModal();
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


sendEmail() {
  this.submitted = true;
  if (this.emailForm.invalid) {
      return;
  }

  if (this.selectedGuardianIds.length == 0) {
      this.toastr.error("No Guardian Selected", 'Error!', { closeButton: true, disableTimeOut: true });
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
      guardianids: this.selectedGuardianIds,
      emailData: emailObj
  };

  formData.append("data", JSON.stringify(data));
  const request = this._service.post('saveGuardianEmail', formData);
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

 clearData(){
     this.selectedGuardianIds = [];
      this.selectedTGuardiansList = [];
      this.selectedGuardiansListExcelData = [];
}

}
