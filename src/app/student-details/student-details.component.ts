import {
  Component,
  TemplateRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnInit,
} from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../_services/common.service";
import { environment } from "../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Page } from "../_models/page";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { MustMatch } from "../_helpers/must-match.validator";
import { ConfirmService } from "../_helpers/confirm-dialog/confirm.service";
import { Location } from "@angular/common";
import * as moment from "moment";
import $ from "jquery";
declare var $: any;

@Component({
  selector: "app-student-details",
  templateUrl: "./student-details.component.html",
  styleUrls: ["./student-details.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class StudentDetailsComponent implements OnInit {
  baseUrl = environment.baseUrl;
  isCollapsed = false;
  is_loaded = false;
  entryForm: FormGroup;
  profileGeneralForm: FormGroup;
  uploadForm: FormGroup;
  bioForm: FormGroup;
  currentAddressForm: FormGroup;
  perticipationAllowForm: FormGroup;
  educationForm: FormGroup;
  jobForm: FormGroup;
  referencesForm: FormGroup;
  submitted = false;
  modalTitle = "Add Student";
  isUpdate = false;
  saveButtonText: string = "Save";
  @BlockUI() blockUI: NgBlockUI;

  invalidAttemptNumber = false;

  studentId;
  examId;

  activeTab = "tabBasic";
  tabSubTitle = "Basic Information";
  tabTitle = "Personal Information";

  modalConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalMdConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalSMConfig: any = { class: "gray modal-sm", backdrop: "static" };
  currentAddressModalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  public categoryList: Array<any> = [];

  page = new Page();

  activeStudentInstitute = [];
  projectDetails = [];
  studentDetails: any;
  subject: any;

  uploadType = "";

  urls = [];
  files = [];

  institute_type;
  institute;

  instituteTypeList: Array<any> = [];
  instituteList: Array<any> = [];

  selectedInstituteList: Array<any> = [];
  selectedInstitute: Array<any> = [];
  divisionList: Array<any> = [];
  districts: Array<any> = [];
  areaList: Array<any> = [];
  isLoad = false;

  blood_group_types = [
    { Id: "A+", Name: "A (+ve)" },
    { Id: "A-", Name: "A (-ve)" },
    { Id: "B+", Name: "B (+ve)" },
    { Id: "B-", Name: "B (-ve)" },
    { Id: "O+", Name: "O (+ve)" },
    { Id: "O-", Name: "O (-ve)" },
    { Id: "AB+", Name: "AB (+ve)" },
    { Id: "AB-", Name: "AB (-ve)" },
  ];
  marital_status_types = [
    { Id: "Single", Name: "Single" },
    { Id: "Married", Name: "Married" },
    { Id: "Divorced", Name: "Divorced" },
  ];
  religions = [
    { Id: "Islam", Name: "Islam" },
    { Id: "Hinduism", Name: "Hinduism" },
    { Id: "Christianity", Name: "Christianity" },
    { Id: "Buddhism", Name: "Buddhism" },
    { Id: "Myth", Name: "Myth" },
    { Id: "Daoism", Name: "Daoism" },
    { Id: "Judaism", Name: "Judaism" },
  ];

  actions: any[] = [
    { value: true, label: "Approve" },
    { value: false, label: "Pending" },
    { value: "delete", label: "Delete" },
  ];

  is_enrolled = false;
  

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private confirmService: ConfirmService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.studentId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    // this.entryForm = this.formBuilder.group(
    //   {
    //     id: [null],
    //     Email: [
    //       null,
    //       [Validators.required, Validators.email, Validators.maxLength(50)],
    //     ],
    //     Password: [null, [Validators.required, Validators.minLength(6)]],
    //     ConfirmPassword: [null, [Validators.required, Validators.minLength(6)]],
    //     FirstName: [null, [Validators.required, Validators.maxLength(50)]],
    //     LastName: [null, [Validators.required, Validators.maxLength(50)]],
    //     IsActive: [true, [Validators.required]],
    //   },
    //   {
    //     validator: MustMatch("Password", "ConfirmPassword"),
    //   }
    // );

    this.profileGeneralForm = this.formBuilder.group({
      student_id: [null],
      name: [null, [Validators.required, Validators.maxLength(550)]],
      email: [null, [Validators.required]],
      mobile_no: [null, [Validators.required]],
      date_of_birth: [null, ],
      gender: ["Male",[Validators.required]],
      father_name: [null,],
      father_mobile: [null, ],
      mother_name: [null, ],
      mother_mobile: [null,],
      
    });

    this.uploadForm = this.formBuilder.group({
      profile: [""],
    });

    this.bioForm = this.formBuilder.group({
      text: [
        "",
        [
          Validators.required,
          Validators.minLength(150),
          Validators.maxLength(250),
        ],
      ],
    });
    this.perticipationAllowForm = this.formBuilder.group({
      count: [null, [Validators.required]],
    });
    this.currentAddressForm = this.formBuilder.group({
      id: [null],
      division_id: [null],
      district_id: [null],
      area_id: [null],
      address: [null],
      student_id: this.studentId,
    });

    this.educationForm = this.formBuilder.group({
      id: [null],
      student_institute_id: [null],
      certificate_number: [null],
      completion_status: ["Enrolled"],
      group: [null],
      edu_title: [null, [Validators.required]],
      institute: [null],
      grade: [null],
      passing_year: [null],
      status: [null],
      student_id: this.studentId,
    });

    this.jobForm = this.formBuilder.group({
      id: [null],
      title: [null, [Validators.required]],
      organization: [null, [Validators.required]],
    });

    this.referencesForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required,]],
      mobile_no: [null],
      relation: [null],
      is_blood_connected: [false],
      designation: [null],
      organization: [null],
      student_id: [null],
      created_at: [null],
      updated_at: [null],
  });

    this.getList();
    this.getInstituteByType();
    this.getDivisions();
    this.getActiveStudentInstitute();
  }

  get pf() {
    return this.profileGeneralForm.controls;
  }

  // get f() {
  //   return this.entryForm.controls;
  // }

  get bio() {
    return this.bioForm.controls;
  }

  get address() {
    return this.currentAddressForm.controls;
  }
  get pa() {
    return this.perticipationAllowForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  getList() {
    this.blockUI.start("Getting Infromations...");
    this._service.get("student/" + this.studentId).subscribe(
      (res) => {
        this.blockUI.stop();
        this.studentDetails = res;
        console.log(this.studentDetails)
        if(res.division_id){
          this.getDistrictByDivision(res.division_id)
        }
      
        if(res.district_id){
            this.getAreaByDistrict(res.district_id)
        }
        this.is_loaded = true;
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

  openProfileModal(studentDetails, template: TemplateRef<any>) {
    this.modalTitle = "Update Information";
    this.saveButtonText = "Update";

    this.profileGeneralForm.controls["student_id"].setValue(studentDetails.id);
    this.profileGeneralForm.controls["name"].setValue(studentDetails.name);
    this.profileGeneralForm.controls["mobile_no"].setValue(studentDetails.mobile_no);
    this.profileGeneralForm.controls["date_of_birth"].setValue(
      studentDetails.date_of_birth
    );
    this.profileGeneralForm.controls["email"].setValue(studentDetails.email);
    this.profileGeneralForm.controls["father_name"].setValue(studentDetails.father_name);
    this.profileGeneralForm.controls["father_mobile"].setValue(studentDetails.father_mobile);
    this.profileGeneralForm.controls["mother_name"].setValue(studentDetails.mother_name);
    this.profileGeneralForm.controls["mother_mobile"].setValue(studentDetails.mother_mobile);
    this.profileGeneralForm.controls["gender"].setValue(studentDetails.gender);

    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  updateProfileInformation() {
    this.submitted = true;
    if (this.profileGeneralForm.invalid) {
      return;
    }
    this.blockUI.start("Updating Infromations...");
    this._service
      .post("student-profile-update", this.profileGeneralForm.value)
      .subscribe(
        (res) => {
          this.toastr.success(res.message, "Successful!");
          this.getList();
          this.modalHide();
          this.profileGeneralForm.reset();
          this.blockUI.stop();
        },
        (err) => {

          // if(err.status==422){
          //   this.toastr.warning(err.error.message, "Attention!");
          //   this.blockUI.stop();
          // }else{
          // this.toastr.warning(err.message, "Attention!");
          // this.blockUI.stop();
          // }

          this.blockUI.stop();

          
        }
      );
  }

  // onFormSubmit() {
  //   this.submitted = true;
  //   if (this.entryForm.invalid) {
  //     return;
  //   }

  //   this.blockUI.start("Saving data...");
  //   const obj = {
  //     Id: this.entryForm.value.id,
  //     Email: this.entryForm.value.Email.trim(),
  //     Password: this.entryForm.value.Password.trim(),
  //     FirstName: this.entryForm.value.FirstName.trim(),
  //     LastName: this.entryForm.value.LastName.trim(),
  //     IsActive: this.entryForm.value.IsActive,
  //   };

  //   this._service.post("Account/CreateOrUpdateUser", obj).subscribe(
  //     (res) => {
  //       this.blockUI.stop();
  //       if (!res.Success) {
  //         this.toastr.error(res.message, "Error!", { timeOut: 2000 });
  //         return;
  //       }

  //       this.toastr.success(res.message, "Success!", { timeOut: 2000 });
  //       this.modalHide();
  //       this.getList();
  //     },
  //     (error) => {
  //       this.blockUI.stop();
  //     }
  //   );
  // }

  onFormSubmitBio() {
    this.submitted = true;
    if (this.bioForm.invalid) {
      return;
    }

    this.blockUI.start("Updating data...");
    const obj = {
      bio: this.bioForm.value.text ? this.bioForm.value.text.trim() : "",
    };

    this._service.post("updateTutorById/" + this.studentId, obj).subscribe(
      (res) => {
        this.blockUI.stop();
        if (res.status == "NotOk") {
          this.toastr.error(res.message, "Error!", { timeOut: 2000 });
          return;
        }

        this.toastr.success(res.message, "Success!", { timeOut: 2000 });
        this.modalHideBio();
        this.getList();
      },
      (error) => {
        this.blockUI.stop();
      }
    );
  }

  backTo() {
    this.location.back();
  }

  modalHide() {
    // this.entryForm.reset();
    this.modalRef.hide();
    this.isUpdate = false;
    this.submitted = false;
    this.modalTitle = "Add Student";
    this.saveButtonText = "Save";
    this.uploadType = "";
  }

  changeStatus(status, tutor) {
    if (!status) {
      return;
    }
    let message = tutor.name + " is in " + status + ".";
    this.confirmService
      .confirm("Are you sure?", "Do you want to change the status?")
      .subscribe((result) => {
        if (result) {
          let params = {
            status: status,
          };

          this.blockUI.start("Changing status...");
          this._service
            .post("updateTutorStatuById/" + tutor.id, params)
            .subscribe(
              (res) => {
                if (res.status == "NotOk") {
                  this.toastr.error(res.message, "Error!");
                  return;
                }
                this.toastr.success(message, "Successful!");
                this.getList();
              },
              (err) => {
                //this.toastr.warning(err.message, 'Attention!');
                this.blockUI.stop();
              }
            );
        }
      });
  }

  changeRank(rank, tutor) {
    if (!rank) {
      return;
    }
    let message = tutor.name + " is in " + rank + " rank.";
    this.confirmService
      .confirm("Are you sure?", "Do you want to change the rank?")
      .subscribe((result) => {
        if (result) {
          let params = {
            bacbon_rank: rank == "null" ? null : rank,
          };

          this.blockUI.start("Changing rank...");
          this._service.post("updateTutorById/" + tutor.id, params).subscribe(
            (res) => {
              this.blockUI.stop();
              if (res.status == "NotOk") {
                this.toastr.error(res.message, "Error!");
                return;
              }
              this.toastr.success(message, "Successful!");
              this.getList();
            },
            (err) => {
              //this.toastr.warning(err.message, 'Attention!');
              this.blockUI.stop();
            }
          );
        }
      });
  }

  deleteVideo(tutor) {
    this.confirmService
      .confirm("Are you sure?", "Do you want to delete the intro video?")
      .subscribe((result) => {
        if (result) {
          this.blockUI.start("Deleting video...");
          this._service.post("delete-intro-video", tutor.id).subscribe(
            (res) => {
              this.blockUI.stop();
              if (res.status == "NotOk") {
                this.toastr.error(res.message, "Error!");
                return;
              }
              this.toastr.success("Video Successfully Deleted", "Successful!");
              this.getList();
            },
            (err) => {
              //this.toastr.warning(err.message, 'Attention!');
              this.blockUI.stop();
            }
          );
        }
      });
  }

  changeTab(tab) {
    this.tabTitle = "Personal Information";
    if (tab == "tabBasic") {
      this.tabSubTitle = "Basic Information";
    }
    if (tab == "tabTuition") {
      this.tabSubTitle = "Connection With Guardians";
    }
    // if (tab == "tabTransaction") {
    //   this.tabSubTitle = "Transaction Information";
    // }
    this.activeTab = tab;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  openModalBio(template: TemplateRef<any>, tutor) {
    this.bioForm.controls["text"].setValue(tutor.bio);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  modalHideBio() {
    this.bioForm.reset();
    this.modalRef.hide();
  }

  openModalAddress(template: TemplateRef<any>, tutor) {
    this.currentAddressForm.controls["current_address"].setValue(
      tutor.current_address
    );
    this.currentAddressForm.controls["permanent_address"].setValue(
      tutor.permanent_address
    );
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  openModalParticipationAllow(template: TemplateRef<any>, subject) {
    this.subject = subject;
    this.perticipationAllowForm.controls["count"].setValue(
      subject.attempt_number
    );
    this.modalRef = this.modalService.show(template, this.modalSMConfig);
  }

  modalHideParticipationAllow() {
    this.perticipationAllowForm.reset();
    this.modalRef.hide();
    this.subject = null;
  }

  checkValidityAttempt(value) {
    if (this.subject.participation_count > Number(value)) {
      this.invalidAttemptNumber = true;
    } else {
      this.invalidAttemptNumber = false;
    }
  }

  participationAllowSubmit() {
    if (
      this.subject.participation_count >
      Number(this.perticipationAllowForm.value.count)
    ) {
      this.toastr.warning(
        "Participation Allow number is not possible less than percipated number!",
        "Attention!"
      );
      return;
    }

    const obj = {
      attempt_number: Number(this.perticipationAllowForm.value.count),
    };

    this.blockUI.start("Uploading ...");
    this._service
      .post("tutor-selected-exam/" + this.subject.select_exam_id, obj)
      .subscribe(
        (res) => {
          this.blockUI.stop();
          this.perticipationAllowForm.reset();
          this.toastr.success(
            "Attempt permission has been updated",
            "Success!",
            { timeOut: 3000 }
          );
          this.getList();
          this.modalHideParticipationAllow();
        },
        (err) => {
          this.blockUI.stop();
          this.toastr.error(err.message || err, "Error!", {
            closeButton: true,
            disableTimeOut: true,
            enableHtml: true,
          });
        }
      );
  }

  modalHideAddress() {
    this.currentAddressForm.reset();
    this.modalRef.hide();
  }

  // getItem(id, template: TemplateRef<any>) {
  //   this.blockUI.start("Saving...");
  //   this._service.get("Account/GetUserById/" + id).subscribe(
  //     (res) => {
  //       this.blockUI.stop();
  //       if (!res.Success) {
  //         this.toastr.error(res.message, "Error!", { timeOut: 2000 });
  //         return;
  //       }
  //       this.entryForm.controls["id"].setValue(res.Record.Id);
  //       this.entryForm.controls["FirstName"].setValue(res.Record.FirstName);
  //       this.entryForm.controls["LastName"].setValue(res.Record.LastName);
  //       this.entryForm.controls["Email"].setValue(res.Record.Email);
  //       this.entryForm.controls["IsActive"].setValue(res.Record.IsActive);
  //       this.entryForm.controls["Password"].setValue("********");
  //       this.entryForm.controls["ConfirmPassword"].setValue("********");

  //       this.modalTitle = "Update User";
  //       this.saveButtonText = "Update";
  //       this.modalRef = this.modalService.show(template, this.modalConfig);
  //     },
  //     (err) => {
  //       this.toastr.error(err.message || err, "Error!", { timeOut: 2000 });
  //       this.blockUI.stop();
  //     }
  //   );
  // }

  onSelectUpoladFile(event) {
    this.uploadForm.reset();
    this.urls = [];
    this.files = [];

    if (event.target.files.length > 0) {
      this.files = event.target.files[0];
      if (event.target.files[0].size > 2000000) {
        this.toastr.error("File size is more then 2MB", "Failed to changed!", {
          timeOut: 3000,
        });
        return;
      } else {
        this.uploadForm.get("profile").setValue(this.files);
        console.log(this.uploadForm.value.profile);
        //this.submitImage();
      }
    }
  }

  UploadIdentityFile(template: TemplateRef<any>, type = "") {
    this.modalTitle = "<h6>Upload Identity File</h6>";
    this.uploadForm.reset();
    if (type) {
      this.uploadType = "Certificate";
    }
    this.modalRef = this.modalService.show(template, this.modalMdConfig);
  }

  UpdateIdentityFileSubmit() {
    if (!this.uploadForm.value.profile) {
      this.toastr.warning("Please, Select File!", "Attention!");
      return;
    }

    if (!this.uploadType) {
      this.toastr.warning("Please, Select File Type!", "Attention!");
      return;
    }

    const formData = new FormData();
    formData.append("files[0]", this.uploadForm.get("profile").value);

    if (this.uploadType == "NID") {
      this.blockUI.start("Uploading File...");
      this._service.post("tutor-nid/" + this.studentId, formData).subscribe(
        (res) => {
          this.blockUI.stop();
          this.uploadForm.reset();
          this.toastr.success(res.message, "Success!", { timeOut: 3000 });
          this.urls = [];
          this.files = [];
          this.getList();
          this.modalHide();
        },
        (err) => {
          this.blockUI.stop();
          this.toastr.error(err.message || err, "Error!", {
            closeButton: true,
            disableTimeOut: true,
            enableHtml: true,
          });
        }
      );
    }

    if (this.uploadType == "Certificate") {
      this.blockUI.start("Uploading File...");
      this._service
        .post("tutor-certificate/" + this.studentId, formData)
        .subscribe(
          (res) => {
            this.blockUI.stop();
            this.uploadForm.reset();
            this.toastr.success(res.message, "Success!", { timeOut: 3000 });
            this.urls = [];
            this.files = [];
            this.getList();
            this.modalHide();
          },
          (err) => {
            this.blockUI.stop();
            this.toastr.error(err.message || err, "Error!", {
              closeButton: true,
              disableTimeOut: true,
              enableHtml: true,
            });
          }
        );
    }

    if (this.uploadType == "Passport") {
      this.blockUI.start("Uploading File...");
      this._service.post("tutor-passport/" + this.studentId, formData).subscribe(
        (res) => {
          this.blockUI.stop();
          this.uploadForm.reset();
          this.toastr.success(res.message, "Success!", { timeOut: 3000 });
          this.urls = [];
          this.files = [];
          this.getList();
          this.modalHide();
        },
        (err) => {
          this.blockUI.stop();
          this.toastr.error(err.message || err, "Error!", {
            closeButton: true,
            disableTimeOut: true,
            enableHtml: true,
          });
        }
      );
    }

    if (this.uploadType == "BirthCertificate") {
      this.blockUI.start("Uploading File...");
      this._service
        .post("tutor-birth-certificate/" + this.studentId, formData)
        .subscribe(
          (res) => {
            this.blockUI.stop();
            this.uploadForm.reset();
            this.toastr.success(res.message, "Success!", { timeOut: 3000 });
            this.urls = [];
            this.files = [];
            this.getList();
            this.modalHide();
          },
          (err) => {
            this.blockUI.stop();
            this.toastr.error(err.message || err, "Error!", {
              closeButton: true,
              disableTimeOut: true,
              enableHtml: true,
            });
          }
        );
    }
  }

  nidActionChange(e, nid, i) {
    if (e && e.value != "delete") {
      let obj = {
        id: nid.id,
        is_approved: e.value,
      };

      this._service.post("update-nid-approval", obj).subscribe(
        (res) => {
          this.studentDetails.nids[i].is_approved = e.value;
          if (res.status === "Ok") {
            if (e.value) {
              this.toastr.success("You have approve this nid", "Success!", {
                timeOut: 3000,
              });
            } else {
              this.toastr.warning(
                "You have make pending this nid",
                "Warning!",
                { timeOut: 3000 }
              );
            }
            this.getList();
          } else {
            this.toastr.warning(res.message, "Warning!", { timeOut: 3000 });
          }
        },
        (err) => {
          this.toastr.error(err.message || err, "Error!", { timeOut: 3000 });
        }
      );
    } else if (e.value == "delete") {
      this.confirmService
        .confirm("Are you sure?", "Do you want to delete this item?")
        .subscribe((result) => {
          if (result) {
            let params = {
              id: nid.id,
            };

            this.blockUI.start("Deleting...");
            this._service.post("delete-nid-by-admin", params).subscribe(
              (res) => {
                this.blockUI.stop();
                if (res.status == "NotOk") {
                  this.toastr.error(res.message, "Error!");
                  return;
                }
                this.toastr.success(res.message, "Successful!");
                this.getList();
              },
              (err) => {
                //this.toastr.warning(err.message, 'Attention!');
                this.blockUI.stop();
              }
            );
          }
        });
    }
  }

  passportActionChange(e, pass, i) {
    if (e && e.value != "delete") {
      let obj = {
        id: pass.id,
        is_approved: e.value,
      };

      this._service.post("update-passport-approval", obj).subscribe(
        (res) => {
          this.studentDetails.passports[i].is_approved = e.value;
          if (res.status === "Ok") {
            if (e.value) {
              this.toastr.success(
                "You have approve this passport",
                "Success!",
                { timeOut: 3000 }
              );
            } else {
              this.toastr.warning(
                "You have make pending this passport",
                "Warning!",
                { timeOut: 3000 }
              );
            }
            this.getList();
          } else {
            this.toastr.warning(res.message, "Warning!", { timeOut: 3000 });
          }
        },
        (err) => {
          this.toastr.error(err.message || err, "Error!", { timeOut: 3000 });
        }
      );
    } else if (e.value == "delete") {
      this.confirmService
        .confirm("Are you sure?", "Do you want to delete this item?")
        .subscribe((result) => {
          if (result) {
            let params = {
              id: pass.id,
            };

            this.blockUI.start("Deleting...");
            this._service.post("delete-passport-by-admin", params).subscribe(
              (res) => {
                this.blockUI.stop();
                if (res.status == "NotOk") {
                  this.toastr.error(res.message, "Error!");
                  return;
                }
                this.toastr.success(res.message, "Successful!");
                this.getList();
              },
              (err) => {
                //this.toastr.warning(err.message, 'Attention!');
                this.blockUI.stop();
              }
            );
          }
        });
    }
  }

  certificateActionChange(e, cert, i) {
    console.log(e)
    console.log(e.value)
    console.log(cert)
    if (e && e.value != "delete") {
      let obj = {
        id: cert.id,
        is_approved: e.value,
      };

      this._service.post("update-certificate-approval", obj).subscribe(
        (res) => {
          this.studentDetails.certificates[i].is_approved = e.value;
          if (res.status === "Ok") {
            if (e.value) {
              this.toastr.success(
                "You have approve this certificate",
                "Success!",
                { timeOut: 3000 }
              );
            } else {
              this.toastr.warning(
                "You have make pending this certificate",
                "Warning!",
                { timeOut: 3000 }
              );
            }
            this.getList();
          } else {
            this.toastr.warning(res.message, "Warning!", { timeOut: 3000 });
          }
        },
        (err) => {
          this.toastr.error(err.message || err, "Error!", { timeOut: 3000 });
        }
      );
    } else if (e.value == "delete") {
      this.confirmService
        .confirm("Are you sure?", "Do you want to delete this item?")
        .subscribe((result) => {
          if (result) {
            let params = {
              id: cert.id,
            };

            this.blockUI.start("Deleting...");
            this._service.post("delete-certificate-by-admin", params).subscribe(
              (res) => {
                this.blockUI.stop();
                if (res.status == "NotOk") {
                  this.toastr.error(res.message, "Error!");
                  return;
                }
                this.toastr.success(res.message, "Successful!");
                this.getList();
              },
              (err) => {
                //this.toastr.warning(err.message, 'Attention!');
                this.blockUI.stop();
              }
            );
          }
        });
    }
  }

  bsActionChange(e, bs, i) {
    if (e && e.value != "delete") {
      let obj = {
        id: bs.id,
        is_approved: e.value,
      };

      this._service.post("update-birth-certificate-approval", obj).subscribe(
        (res) => {
          this.studentDetails.birth_certificates[i].is_approved = e.value;
          if (res.status === "Ok") {
            if (e.value) {
              this.toastr.success(
                "You have approve this birth certificate",
                "Success!",
                { timeOut: 3000 }
              );
            } else {
              this.toastr.warning(
                "You have make pending this birth certificate",
                "Warning!",
                { timeOut: 3000 }
              );
            }
            this.getList();
          } else {
            this.toastr.warning(res.message, "Warning!", { timeOut: 3000 });
          }
        },
        (err) => {
          this.toastr.error(err.message || err, "Error!", { timeOut: 3000 });
        }
      );
    } else if (e.value == "delete") {
      this.confirmService
        .confirm("Are you sure?", "Do you want to delete this item?")
        .subscribe((result) => {
          if (result) {
            let params = {
              id: bs.id,
            };

            this.blockUI.start("Deleting...");
            this._service
              .post("delete-birth-certificate-by-admin", params)
              .subscribe(
                (res) => {
                  this.blockUI.stop();
                  if (res.status == "NotOk") {
                    this.toastr.error(res.message, "Error!");
                    return;
                  }
                  this.toastr.success(res.message, "Successful!");
                  this.getList();
                },
                (err) => {
                  //this.toastr.warning(err.message, 'Attention!');
                  this.blockUI.stop();
                }
              );
          }
        });
    }
  }

  getInstituteByType() {
    this._service.get("getInstituteByType").subscribe(
      (res) => {
        this.instituteTypeList = res;
      },
      (err) => {}
    );
  }

  ChangeCompletionStatus(completion_status) {
    if(this.educationForm.value.completion_status == "Enrolled"){
      this.is_enrolled = true;
      this.educationForm.controls['grade'].setValue(null);
      this.educationForm.controls['passing_year'].setValue(null);
  }else{
      this.is_enrolled = false; 
  }
  }

  changeInstituteType(institute) {
    this.institute = null;
    this.educationForm.controls["institute"].setValue("");
    if (!institute) {
      return;
    }
    this.instituteList = institute.institutes;
  }


  updateCurrentAddressModal(student, template: TemplateRef<any>){
    this.modalTitle = '<h6>Update Current Address</h6>';
    //this.address = student.address;
    this.currentAddressForm.controls['division_id'].setValue(student.division_id);
    this.currentAddressForm.controls['district_id'].setValue(student.district_id);
    this.currentAddressForm.controls['area_id'].setValue(student.area_id);
    this.currentAddressForm.controls['address'].setValue(student.address);
    this.modalRef = this.modalService.show(template, this.currentAddressModalConfig);
}

getDivisions() {
  this.blockUI.start('Getting Infromations...');
  this._service.get('get-divisions-with-districts').subscribe(res => {
      this.divisionList = res;
      this.isLoad = true;
      this.blockUI.stop()
  }, err => { }
  );
}

onDivisionChange(event){
  this.getDistrictByDivision(event.id)
  this.currentAddressForm.controls['district_id'].setValue('');
  this.currentAddressForm.controls['area_id'].setValue('');
}

onDistrictChange(event){
 this.getAreaByDistrict(event.id)
 this.currentAddressForm.controls['area_id'].setValue('');
}


getDistrictByDivision(divisionId){
  this.blockUI.start('Getting District Infromations...');
  this._service.get('district-by-division/'+ divisionId).subscribe(res => {
      this.districts = res.data;
      this.isLoad = true;
      this.blockUI.stop()
  }, err => { }
  );
}

getAreaByDistrict(districtId){
  this.blockUI.start('Getting Area Infromations...');
  this._service.get('area-by-district/'+ districtId).subscribe(res => {
      this.areaList = res.data;
      this.isLoad = true;
      this.blockUI.stop()
      this.blockUI.stop()
  }, err => { }
  );
}

onFormSubmitAddress() {
  this.submitted = true;
  if (this.currentAddressForm.invalid) {
    return;
  }

  //this.blockUI.start("Updating address data...");
  if(!this.currentAddressForm.value.division_id){
    this.toastr.warning("Please, Select division!", 'Attention!');
    return;
  }

  if(!this.currentAddressForm.value.district_id){
      this.toastr.warning("Please, Select district!", 'Attention!');
      return;
  }

  if(!this.currentAddressForm.value.area_id){
      this.toastr.warning("Please, Select area!", 'Attention!');
      return;
  }

  if(!this.currentAddressForm.value.address){
      this.toastr.warning("Please, Enter your address!", 'Attention!');
      return;
  }

  this.blockUI.start('Updating Infromations...');
  let params = {
      division_id: this.currentAddressForm.value.division_id,
      district_id: this.currentAddressForm.value.district_id,
      area_id: this.currentAddressForm.value.area_id,
      address: this.currentAddressForm.value.address,
      student_id: this.studentId
  }
  this._service.post('student-address-update', params).subscribe(res => {
      this.toastr.success(res.message, 'Successful!');
      this.getList();
      this.modalHide();
      this.blockUI.stop();
  }, err => {
      this.toastr.warning(err.message, 'Attention!');
      this.blockUI.stop();
  });
}

  addEducationModal(template: TemplateRef<any>) {
    this.educationForm.reset();
    this.modalTitle = "<h6>Add Education Information</h6>";
    this.educationForm.controls["completion_status"].setValue("Enrolled");
    this.is_enrolled = true;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  updateEducationModal(education, template: TemplateRef<any>) {
    this.educationForm.reset();
    this.modalTitle = "<h6>Update Education Information</h6>";
   // this.blockUI.start("Getting Infromations...");
    
    this.educationForm.controls['id'].setValue(education.id);
    this.educationForm.controls['edu_title'].setValue(education.edu_title);
    this.educationForm.controls['student_institute_id'].setValue(education.student_institute_id);
    this.educationForm.controls['certificate_number'].setValue(education.certificate_number);
    this.educationForm.controls['completion_status'].setValue(education.completion_status);
    this.educationForm.controls['group'].setValue(education.group);
    this.educationForm.controls['grade'].setValue(education.grade);
    this.educationForm.controls['passing_year'].setValue(this.getDateFormat(education.passing_year));
    this.educationForm.controls['status'].setValue(education.status);
    this.modalRef = this.modalService.show(template, this.modalConfig);
    if(education.completion_status=='Enrolled'){
      this.is_enrolled=true
    }else{
      this.is_enrolled=false
    }
   
  }

UpdateEducationSubmit() {

    if(!this.educationForm.value.edu_title){
      this.toastr.warning("Please, Select exam title!", 'Attention!');
      return;
   }

  if(!this.educationForm.value.student_institute_id){
      this.toastr.warning("Please, Select institute!", 'Attention!');
      return;
  }

  if(!this.educationForm.value.group){
      this.toastr.warning("Please, Deparment is reuired!", 'Attention!');
      return;
  }

  if (this.educationForm.value.completion_status=='Passed' && !this.educationForm.value.grade) {
  this.toastr.warning("Please, Grade is required!", "Attention!");
  return;
  }
  
  if ((this.educationForm.value.completion_status=='Passed' && !this.educationForm.value.passing_year) ||  (this.educationForm.value.completion_status=='Passed' && this.educationForm.value.passing_year=='Invalid date')) {
  this.toastr.warning("Please, Choose passing year!", "Attention!");
  return;
  }

  if(this.educationForm.value.id){ // update api
      let params = {
          id: this.educationForm.value.id,
          student_id: this.studentId,
          edu_title: this.educationForm.value.edu_title,
          student_institute_id: this.educationForm.value.student_institute_id,
          group: this.educationForm.value.group,
          completion_status: this.educationForm.value.completion_status,
          grade: this.educationForm.value.grade,
          certificate_number: this.educationForm.value.certificate_number,
          passing_year: this.educationForm.value.passing_year,
      }
      console.log(params)
      this.blockUI.start('Updating Infromations...');

      this._service.post('student-education/'+ this.educationForm.value.id+'/'+this.studentId, params).subscribe(res => {
        console.log(res)
          this.toastr.success(res.message, 'Successful!');
          this.getList();
          this.modalHideEdu();
          this.educationForm.reset();
          this.blockUI.stop();
      }, err => {
        this.blockUI.stop();
          // if(err.status==422){
          //     this.toastr.warning(err.error.message, 'Attention!');
          // this.blockUI.stop();
          // }else{
          // this.toastr.warning(err.message, 'Attention!');
          // this.blockUI.stop();
          // }
      });
  }
  else{ // create api
      let params = {
                      student_id: this.studentId,
                      edu_title: this.educationForm.value.edu_title,
                      student_institute_id: this.educationForm.value.student_institute_id,
                      group: this.educationForm.value.group,
                      completion_status: this.educationForm.value.completion_status,
                      grade: this.educationForm.value.grade,
                      certificate_number: this.educationForm.value.certificate_number,
                      passing_year: this.educationForm.value.passing_year,
                  }
                  
      this.blockUI.start('Saving Infromations...');
      this._service.post('student-education', params).subscribe(res => {
          this.toastr.success(res.message, 'Successful!');
          this.getList();
          this.modalHideEdu();
          this.educationForm.reset();
          this.blockUI.stop();
      }, err => {
        this.blockUI.stop();
      });
  }

}

getActiveStudentInstitute() {
  this._service.get('student-institute-active').subscribe(res => {
      this.activeStudentInstitute = res.data;
      console.log(res)
  }, err => { }
  );
}
  getDateFormat(value: Date) {
    return moment(value).format("YYYY-MM-DD");
  }

  updateJobModal(job, template: TemplateRef<any>) {
    this.modalTitle = "<h6>Update Work Experience</h6>";
    this.jobForm.controls["id"].setValue(job.id);
    this.jobForm.controls["title"].setValue(job.work_title);
    this.jobForm.controls["organization"].setValue(job.organization);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  addJobModal(template: TemplateRef<any>) {
    this.jobForm.reset();
    this.modalTitle = "<h6>Add Employment Information</h6>";
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  UpdateJobSubmit() {
    if (!this.jobForm.value.title) {
      this.toastr.warning("Please, enter title!", "Attention!");
      return;
    }

    if (!this.jobForm.value.organization) {
      this.toastr.warning("Please, enter organization!", "Attention!");
      return;
    }

    this.blockUI.start("Updating Infromations...");

    if (this.jobForm.value.id) {
      let params = {
        id: this.jobForm.value.id,
        end_date: null,
        is_currently_working: false,
        join_date: null,
        status: null,
        work_title: this.jobForm.value.title
          ? this.jobForm.value.title.trim()
          : "",
        organization: this.jobForm.value.organization
          ? this.jobForm.value.organization.trim()
          : "",
        student_id: this.studentId,
      };

      this._service.post("tutor-work-experience-update", params).subscribe(
        (res) => {
          this.toastr.success(res.message, "Successful!");
          this.getList();
          this.modalHideWE();
          this.blockUI.stop();
        },
        (err) => {
          this.toastr.warning(err.message, "Attention!");
          this.blockUI.stop();
        }
      );
    } else {
      let params = {
        educations: [
          {
            work_title: this.jobForm.value.title
              ? this.jobForm.value.title.trim()
              : "",
            organization: this.jobForm.value.organization
              ? this.jobForm.value.organization.trim()
              : "",
          },
        ],
        student_id: this.studentId,
      };

      this._service.post("tutor-work-experience-multiple", params).subscribe(
        (res) => {
          this.toastr.success(res.message, "Successful!");
          this.getList();
          this.modalHideWE();
          this.blockUI.stop();
        },
        (err) => {
          this.toastr.warning(err.message, "Attention!");
          this.blockUI.stop();
        }
      );
    }
  }

  modalHideEdu() {
    this.modalRef.hide();
    this.uploadType = "";
    this.modalTitle = "Update";
  }

  modalHideWE() {
    this.modalRef.hide();
    this.uploadType = "";
    this.modalTitle = "Update";
  }

  modalHideSchedule() {
    this.modalRef.hide();
    this.uploadType = "";
    this.modalTitle = "Update";
  }

  modalHideRef() {
    this.modalRef.hide();
    this.uploadType = "";
    this.modalTitle = "Update";
  }

  setOrRemoveDay(data, day, session) {
    data.forEach((item) => {
      if (session == item.session) {
        if (day == "sat") {
          if (item.sat) {
            item.sat = false;
          } else {
            item.sat = true;
          }
        }
        if (day == "sun") {
          if (item.sun) {
            item.sun = false;
          } else {
            item.sun = true;
          }
        }
        if (day == "mon") {
          if (item.mon) {
            item.mon = false;
          } else {
            item.mon = true;
          }
        }
        if (day == "tue") {
          if (item.tue) {
            item.tue = false;
          } else {
            item.tue = true;
          }
        }
        if (day == "wed") {
          if (item.wed) {
            item.wed = false;
          } else {
            item.wed = true;
          }
        }
        if (day == "thu") {
          if (item.thu) {
            item.thu = false;
          } else {
            item.thu = true;
          }
        }
        if (day == "fri") {
          if (item.fri) {
            item.fri = false;
          } else {
            item.fri = true;
          }
        }
      }
    });
  }

  OpenUpdateScheduletModal(template: TemplateRef<any>) {
    this.modalTitle = "<h6>Upload Schedule</h6>";
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  UpdateScheduleSubmit(schedule) {
    this.blockUI.start("Updating Schedule...");
    this._service.post("tutor-schedule", schedule).subscribe(
      (res) => {
        this.blockUI.stop();
        this.toastr.success(res.message, "Success!", { timeOut: 3000 });
        this.getList();
        this.modalHideSchedule();
      },
      (err) => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, "Error!", {
          closeButton: true,
          disableTimeOut: true,
          enableHtml: true,
        });
      }
    );
  }




  openUpdateReferenceModal(reference, template: TemplateRef<any>){
    this.modalTitle = '<h6>Update Reference</h6>';
    console.log(reference);
    this.referencesForm.controls['id'].setValue(reference.id);
    this.referencesForm.controls['name'].setValue(reference.name);
    this.referencesForm.controls['mobile_no'].setValue(reference.mobile_no);
    this.referencesForm.controls['relation'].setValue(reference.relation);
    this.referencesForm.controls['is_blood_connected'].setValue(reference.is_blood_connected);
    this.referencesForm.controls['designation'].setValue(reference.designation);
    this.referencesForm.controls['organization'].setValue(reference.organization);
    this.referencesForm.controls['student_id'].setValue(reference.student_id);
    this.referencesForm.controls['created_at'].setValue(reference.created_at);
    this.referencesForm.controls['updated_at'].setValue(reference.updated_at);

    this.modalRef = this.modalService.show(template, this.modalConfig);
}



UpdateReferencesSubmit(){
  this.blockUI.start('Updating Infromations...');

  this._service.post('tutor-reference-update', this.referencesForm.value).subscribe(res => {
      this.toastr.success(res.message, 'Successful!');
      this.getList();
      this.modalHideRef();
      this.blockUI.stop();
  }, err => {
      this.toastr.warning(err.message, 'Attention!');
      this.blockUI.stop();
  });
}








}
