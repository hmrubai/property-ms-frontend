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
import { Subject } from "rxjs/internal/Subject";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from "rxjs";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
declare var $: any;

@Component({
  selector: "app-guardian-details",
  templateUrl: "./guardian-details.component.html",
  styleUrls: ["./guardian-details.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class GuardianDetailsComponent implements OnInit {
  baseUrl = environment.baseUrl;
  FormStudent: FormGroup;
  entryFormStudent: FormGroup;
  entryFormJob: FormGroup;
  profileGeneralForm: FormGroup;
  currentAddressForm: FormGroup;
  submitted = false;
  job_submitted = false;
  modalTitle = "";
  modalTitleHire = "";
  modalTitleJob = "Create Job";
  stdUpdateSubmit = "";
  modalTitleAddStudent = "";
  saveButtonText: string = "Save";
  @BlockUI() blockUI: NgBlockUI;
  bsConfig: Partial<BsDatepickerConfig>
  count = [];
  guardianId;
  guardian;
  modalConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalMdConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalSMConfig: any = { class: "gray modal-sm", backdrop: "static" };

  currentAddressModalConfig: any = { class: 'gray modal-md', backdrop: 'static' };

  modalRef: BsModalRef;
  modalRefStudent: BsModalRef;
  modalRefHire: BsModalRef;
  modalRefJob: BsModalRef;
  tutorSearchText: string = "";
  isSearching = false;
  noDataFoundTextShow = false;
  tutorSearchResult = [];
  rows = [];
  searchedTutor;
  selectedStudent;
  hireData;
  mode: any;
  installmentDates = [];
  installmentAmounts = [];
  mediumList: Array<any> = [];
  subjectList: Array<any> = [];

  loadingIndicator = false;
  ColumnMode = ColumnMode;
  page = new Page();
  public currentUser: any;

  districtList: Array<any> = [];
  
  divisionList: Array<any> = [];
  districts: Array<any> = [];
  areaList: Array<any> = [];
  isLoad = false;
  classlist;

  customInput: Subject<string> = new Subject();
  private _searchRequest: Subscription;


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
    this.guardianId = this.route.snapshot.paramMap.get("id");

    this.authService.currentUserDetails.subscribe((value) => {
      this.currentUser = value;
    });
  }

  ngOnInit() {
    
    this.FormStudent = this.formBuilder.group(
      {
        id: [null,],
        class_id: [null, [Validators.required]],
        name: [null, [Validators.required]],
        age: [null, [Validators.required]],
        gender: [null, [Validators.required]],
        institute: [null, [Validators.required]]
      }
    );

    this.entryFormStudent = this.formBuilder.group(
      {
        name: [null, [Validators.required]],
        age: [null, [Validators.required]],
        gender: [null, [Validators.required]],
        institute: [null, [Validators.required]]
      }
    );

    this.entryFormJob = this.formBuilder.group({
      name: [null, [Validators.required]],
      title: [null, [Validators.required, Validators.maxLength(250)]],
      slot: [null, [Validators.required]],
      slot_type: [null, [Validators.required]],
      salary: [null, [Validators.required]],
      salary_type: [null, [Validators.required]],
      time: [null, [Validators.required]],
      district: [null, [Validators.required]],
      area: [null, [Validators.required]],
      medium: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      note: [null],
      meridian: [null, [Validators.required]],

    });
    this.customInput.pipe(debounceTime(700), distinctUntilChanged()).subscribe(value => {
      this.onSearchKeyUp(value);

    });
    this.bsConfig = Object.assign({}, {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD-MMM-YYYY'
    });
    this.profileGeneralForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.maxLength(550)]],
      email: [null, [Validators.required]],
      mobile_no: [null, [Validators.required]],
      date_of_birth: [null, ],
      gender: ["Male"],
    });
    this.currentAddressForm = this.formBuilder.group({
      id: [null],
      division_id: [null],
      district_id: [null],
      area_id: [null],
      address: [null],
      guardian_id: this.guardianId,
  });

    this.getMediumList();
    this.getSubjectList();
    this.getDetails();
    this.getDivisions();
    this.getClassList()
  }

  get pf() {
    return this.profileGeneralForm.controls;
  }



openProfileModal(guardian, template: TemplateRef<any>) {
  this.modalTitle = "Update Information";
  this.saveButtonText = "Update";

  this.profileGeneralForm.controls["id"].setValue(guardian.id);
  this.profileGeneralForm.controls["name"].setValue(guardian.name);
  this.profileGeneralForm.controls["mobile_no"].setValue(guardian.mobile_no);
  this.profileGeneralForm.controls["date_of_birth"].setValue(
    guardian.date_of_birth
  );
  this.profileGeneralForm.controls["email"].setValue(guardian.email);
  this.profileGeneralForm.controls["gender"].setValue(guardian.gender);

  this.modalRef = this.modalService.show(template, this.modalMdConfig);
}
getClassList(){
  this._service.get('class-list').subscribe(res => {
      this.classlist = res;
      console.log(this.classlist)
  }, err => { }
  );
}

  getMediumList() {
    this._service.get('medium').subscribe(res => {
      this.mediumList = res;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  getSubjectList() {
    this._service.get('master-course').subscribe(res => {
      this.subjectList = res;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }


  get f() {
    return this.entryFormJob.controls;
  }

  get std() {
    return this.FormStudent.controls;
  }

  get s() {
    return this.entryFormStudent.controls;
  }

  getFileType(item) {
    let itemNameArr = item.split(".");
    let ext = itemNameArr[itemNameArr.length - 1];
    switch (ext) {
      case "pdf":
        return "pdf";
      case "png":
        return "png";
      case "jpg":
        return "png";
      case "jpeg":
        return "png";
    }
  }


  getDetails() {
    this.blockUI.start("Getting Infromations...");
    this._service.get("guardian/" + this.guardianId).subscribe(
      (res) => {
        this.blockUI.stop();
        this.guardian = res;

        if(res.division_id){
          this.getDistrictByDivision(res.division_id)
        }
      
        if(res.district_id){
            this.getAreaByDistrict(res.district_id)
        }
      },
      (err) => {
        this.blockUI.stop();
      }
    );
  }




  openCreateStudentModal(template: TemplateRef<any>) {
    this.modalTitleAddStudent = "Add Student";
    this.stdUpdateSubmit = "Add";
    this.modalRef = this.modalService.show(template, this.modalMdConfig);
  }

  openUpdateStudentModal(kid,template: TemplateRef<any>) {
    console.log(kid)
    this.stdUpdateSubmit = "Update";
    this.modalTitleAddStudent = "Update Student";
    this.FormStudent.controls['id'].setValue(kid.id);
    this.FormStudent.controls['name'].setValue(kid.name);
    this.FormStudent.controls['age'].setValue(kid.age);
    this.FormStudent.controls['gender'].setValue(kid.gender);
    this.FormStudent.controls['class_id'].setValue(kid.class_id);
    this.FormStudent.controls['institute'].setValue(kid.institute_name);

    //this.modalRefStudent = this.modalService.show(template, this.modalMdConfig);
    this.modalRef = this.modalService.show(template, this.modalMdConfig);
  } 

  CreateUpdateStudentSubmit() {
    
    this.submitted = true;
    if (this.FormStudent.invalid) {
        return;
    }
    console.log('good')
    if(!this.FormStudent.value.name){
      this.toastr.warning("Please, Enter name!", 'Attention!');
      return;
    }
    
    if(!this.FormStudent.value.age){
      this.toastr.warning("Please, Enter age!", 'Attention!');
      return;
    }
    
    if(!this.FormStudent.value.gender){
      this.toastr.warning("Please, Select gender!", 'Attention!');
      return;
    }
    
    if(!this.FormStudent.value.class_id){
      this.toastr.warning("Please, Choose Class!", 'Attention!');
      return;
    }
    
    if(!this.FormStudent.value.institute){
      this.toastr.warning("Please, Enter institute!", 'Attention!');
      return;
    }

    if(this.FormStudent.value.id){ // update api
      const params = {
        id: this.FormStudent.value.id,
        name: this.FormStudent.value.name,
        age: this.FormStudent.value.age,
        gender: this.FormStudent.value.gender,
        class_id: this.FormStudent.value.class_id,
        institute: this.FormStudent.value.institute,
        guardian_id: this.guardianId
      };

      this.blockUI.start('Updating Infromations...');
      this._service.post('children/'+this.FormStudent.value.id, params).subscribe(res => {
          this.toastr.success(res.message, 'Successful!');
          this.getDetails();
          this.modalHide();
          this.FormStudent.reset();
          this.blockUI.stop();
      }, err => {
          this.toastr.warning(err.message, 'Attention!');
          this.blockUI.stop();
      });
    }else{ // create api
      const params = {
        name: this.FormStudent.value.name,
        age: this.FormStudent.value.age,
        gender: this.FormStudent.value.gender,
        class_id: this.FormStudent.value.class_id,
        institute: this.FormStudent.value.institute,
        guardian_id: this.guardianId
      };

      this.blockUI.start('Updating Infromations...');
      this._service.post('children', params).subscribe(res => {
          this.toastr.success(res.message, 'Successful!');
          this.getDetails();
          this.modalHide();
          this.FormStudent.reset();
          this.blockUI.stop();
      }, err => {
          this.toastr.warning(err.message, 'Attention!');
          this.blockUI.stop();
      });
    }
   
   
  }

  openAddStudentModal(template: TemplateRef<any>) {
    this.modalRefHire.hide();
    this.modalTitleAddStudent = "Add Student";
    this.modalRefStudent = this.modalService.show(template, this.modalMdConfig);
  }

  modalHideAddStudent(template: TemplateRef<any>) {
    this.modalRefStudent.hide();
    this.modalTitleHire = "HIRE " + this.searchedTutor.name;
    this.modalRefHire = this.modalService.show(template, this.modalConfig);
  }



  openSearchTutorModal(template: TemplateRef<any>) {
    this.modalTitle = "Search Tutor";
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  modalHideSearchTutor() {
    this.modalRef.hide();
    this.modalTitle = '';
    this.tutorSearchText = "";
    this.tutorSearchResult = [];
    this.isSearching = false;
    this.noDataFoundTextShow = false;
  }

  openHireTutorModal(item, templateHire: TemplateRef<any>) {
    this.mode = "home";
    this.modalRef.hide();
    this.modalTitleHire = "HIRE " + item.name;
    this.searchedTutor = item;
    this.modalRefHire = this.modalService.show(templateHire, this.modalConfig);

    let tuition = {
      tutor_id: item.id,
      guardian_id: this.guardian.id,
      created_by: this.currentUser.id
    }

    this.hireData = {
      tuition: tuition
    }

    console.log(item);
  }


  onChangeHireMode(e) {
    if (this.mode === "online") {
      this.hireData.hire_mode = 'online'
      this.hireData.amount = null
    }
    if (this.mode === "home") 
      this.hireData.hire_mode = 'home';
    if (this.mode === "contract") 
      this.hireData.hire_mode = 'contract';
    

  }

  modalHideHireTutor(template) {
    this.modalRefHire.hide();
    this.modalTitleHire = '';
    this.searchedTutor = null;
    this.selectedStudent = null;
    this.openSearchTutorModal(template);
  }

  inputValueChanged(event) {
    this.customInput.next(event);
  }

  onSearchKeyUp(value) {
    this.tutorSearchResult = [];
    if (!value) return;
    this.isSearching = true;
    if (this._searchRequest) {
      this._searchRequest.unsubscribe();
    }
    this._searchRequest = this._service.get("tutor/searchApprovedTutorByFields/" + value).subscribe(
      (res) => {
        this.isSearching = false;
        this.tutorSearchResult = res.records;
        this.noDataFoundTextShow = res.records.length == 0 ? true : false;
      },
      (err) => {
        this.isSearching = false;
      }
    );


  }

  updateProfileInformation() {
    this.submitted = true;
    if (this.profileGeneralForm.invalid) {
      return;
    }
    let params = {
      name: this.profileGeneralForm.value.name,
      email: this.profileGeneralForm.value.email,
      mobile_no: this.profileGeneralForm.value.mobile_no,
      gender: this.profileGeneralForm.value.gender,
      date_of_birth: this.profileGeneralForm.value.date_of_birth,
      id: this.profileGeneralForm.value.id,
  }
    this.blockUI.start("Updating Infromations...");
    this._service
      .post('updateGuardian/' + this.profileGeneralForm.value.id, params)
      .subscribe(
        (res) => {
          this.toastr.success(res.message, "Successful!");
          this.getDetails();
          this.modalHide();
          this.profileGeneralForm.reset();
          this.blockUI.stop();
        },
        (err) => {
          this.toastr.warning(err.message, "Attention!");
          this.blockUI.stop();
        }
      );
  }

  updateCurrentAddressModal(guardian, template: TemplateRef<any>){
    this.modalTitle = '<h6>Update Current Address</h6>';
    this.currentAddressForm.controls['id'].setValue(guardian.id);
    this.currentAddressForm.controls['address'].setValue(guardian.address);
    this.currentAddressForm.controls['division_id'].setValue(guardian.division_id);
    this.currentAddressForm.controls['district_id'].setValue(guardian.district_id);
    this.currentAddressForm.controls['area_id'].setValue(guardian.area_id);
    this.currentAddressForm.controls['address'].setValue(guardian.address);
    this.modalRef = this.modalService.show(template, this.currentAddressModalConfig);
}

  onFormSubmitAddress() {
    this.submitted = true;
    if (this.currentAddressForm.invalid) {
      return;
    }
  
    if(!this.currentAddressForm.value.division_id){
      this.toastr.warning("Please, select Division!", 'Attention!');
      return;
    }
  
    if(!this.currentAddressForm.value.district_id){
        this.toastr.warning("Please, select District!", 'Attention!');
        return;
    }
  
    if(!this.currentAddressForm.value.area_id){
        this.toastr.warning("Please, select Area!", 'Attention!');
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
        id: this.currentAddressForm.value.id,
    }
    this._service.post('updateGuardian/' + this.currentAddressForm.value.id, params).subscribe(res => {
        this.toastr.success(res.message, 'Successful!');
        this.getDetails();
        this.modalHide();
        this.blockUI.stop();
    }, err => {
        this.toastr.warning(err.message, 'Attention!');
        this.blockUI.stop();
    });
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

  onDistrictChange(event){
    this.getAreaByDistrict(event.id)
    this.currentAddressForm.controls['area_id'].setValue('');
   }
  
  onDivisionChange(event){
    this.getDistrictByDivision(event.id)
    this.currentAddressForm.controls['district_id'].setValue('');
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

  onFormSubmit() {
    // this.submitted = true;
    // if (this.entryForm.invalid) {
    //   return;
    // }

    // this.blockUI.start("Saving data...");
    // const obj = {
    //   Id: this.entryForm.value.id,
    //   Email: this.entryForm.value.Email.trim(),
    //   Password: this.entryForm.value.Password.trim(),
    //   FirstName: this.entryForm.value.FirstName.trim(),
    //   LastName: this.entryForm.value.LastName.trim(),
    //   IsActive: this.entryForm.value.IsActive,
    // };

    // this._service.post("Account/CreateOrUpdateUser", obj).subscribe(
    //   (res) => {
    //     this.blockUI.stop();
    //     if (!res.Success) {
    //       this.toastr.error(res.message, "Error!", { timeOut: 2000 });
    //       return;
    //     }

    //     this.toastr.success(res.message, "Success!", { timeOut: 2000 });
    //     this.modalHide();
    //     this.getDetails();
    //   },
    //   (error) => {
    //     this.blockUI.stop();
    //   }
    // );
  }

  modalHide() {
    this.FormStudent.reset();
    this.modalRef.hide();
    this.submitted = false;
    //this.modalTitle = "Add Student";
    this.saveButtonText = "Save";
  }

  SubmitHireTutor(template: TemplateRef<any>) {

    if (!this.selectedStudent && this.entryFormStudent.invalid) {
      this.toastr.warning('Please select a student first', 'Warning!', { timeOut: 2000 });
      this.submitted = true;
      return;
    }
    if(!this.hireData.amount){
      this.toastr.warning('Please select a negotiated amount', 'Warning!', { timeOut: 2000 });
      return;
    }
    let subjectList = [];
    let tuition_installments = [];

    this.searchedTutor.preferred_subjects.forEach(element => {
      if (element.checked) {
        if(!element.amount){
          this.toastr.warning('Please fillup the subject amount of the selected subjects', 'Warning!', { timeOut: 2000 });
          return;
        }
        subjectList.push({
          course_id: element.course_id,
          class_id: element.class_id,
          medium_id: element.medium_id,
          amount: element.amount
        })
      }
    });
    if(subjectList.length<=0){
      this.toastr.warning('Please select at least one subject', 'Warning!', { timeOut: 2000 });
      return;
    }
    if (this.hireData.hire_mode === 'contract') {
      this.installmentDates.forEach((element, index) => {
        tuition_installments.push({
          installment_date: element,
          installment_amount: this.installmentAmounts[index]
        })
      })
    }
    const obj = {
      student_id: this.selectedStudent.id ?? null,
      amount: this.hireData.hire_mode === 'online' ? null : this.hireData.amount,
      charge_amount: this.hireData.chargeAmount,
      charge_percentage: this.hireData.chargePercentage,
      day_slot: this.hireData.day_slot,
      hire_mode: this.hireData.hire_mode ? this.hireData.hire_mode : 'home' ,
      close_date: this.hireData.closeDate ? moment(this.hireData.closeDate).format('YYYY-MM-DD') : null,
      start_date: this.hireData.startDate ? moment(this.hireData.startDate).format('YYYY-MM-DD') : null,
      tuition: {
        guardian_id: this.guardian.id ?? null,
        tutor_id: this.searchedTutor.id,
        created_by: this.currentUser.id
      },
      subjects: subjectList,
      tuition_installments: tuition_installments,
      kid: this.selectedStudent.id ?? {
        name: this.entryFormStudent.value.name ? this.entryFormStudent.value.name.trim() : null,
        age: this.entryFormStudent.value.age,
        gender: this.entryFormStudent.value.gender,
        institute: this.entryFormStudent.value.institute ? this.entryFormStudent.value.institute.trim() : null,
        guardian_id: this.guardian.id
      }
    };

    this.blockUI.start('Saving...');
    const request = this._service.post('makeConnection', obj);
    this.submitted = false;
    request.subscribe(
      data => {
        this.blockUI.stop();
        if (data.status === "Ok") {
          this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
          this.submitted = false;
          this.modalHideHireTutor(template);
          this.getDetails();
        } else {
          this.toastr.warning(data.message, 'Warning!', { timeOut: 2000, closeButton: true, disableTimeOut: false });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.warning(err.message || err, 'Warning!', { timeOut: 2000, closeButton: true, disableTimeOut: false });
      }
    );

  }


  counter(i: number) {
    return new Array(i);
  }

  AddStudentInList(template: TemplateRef<any>) {
    const obj = {
      name: this.entryFormStudent.value.name,
      age: this.entryFormStudent.value.age,
      gender: this.entryFormStudent.value.gender,
      institute: this.entryFormStudent.value.institute,
    };
    this.guardian.kids.push(obj);
    this.modalHideAddStudent(template);
  }

  modalHideCreateJob() {
    this.modalRefJob.hide();
  }

  openJobModal(template: TemplateRef<any>) {
    this.modalRefJob = this.modalService.show(template, this.modalConfig);
  }

  SubmitCreateJob() {
    this.job_submitted = true;
    if (this.entryFormJob.invalid) {
      return;
    }

    const obj = {
      guardian_id: this.guardianId,
      child_id: this.entryFormJob.value.name.id,
      tuition_time: this.entryFormJob.value.time + " " + this.entryFormJob.value.meridian,
      district_id: this.entryFormJob.value.district ?? null,
      area_id: this.entryFormJob.value.area ?? null,
      medium_id: this.entryFormJob.value.medium,
      salary_amount: this.entryFormJob.value.salary,
      salary_duration_type: this.entryFormJob.value.salary_type,
      slot_days_amount: this.entryFormJob.value.slot,
      slot_days_type: this.entryFormJob.value.slot_type,
      subjects: this.entryFormJob.value.subject,
      note: this.entryFormJob.value.note ? this.entryFormJob.value.note.trim() : null,
      title: this.entryFormJob.value.title ? this.entryFormJob.value.title.trim() : null,
      admin_id: this.currentUser.id,
    };

    this.blockUI.start('Saving...');
    const request = this._service.post('create-guardian-job', obj);
    this.job_submitted = false;
    request.subscribe(
      data => {
        this.blockUI.stop();
        if (data.status === "Ok") {
          this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
          this.entryFormJob.reset();
          this.modalRefJob.hide();
        } else {
          this.toastr.warning(data.message, 'Warning!', { timeOut: 2000, closeButton: true, disableTimeOut: false });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.warning(err.message || err, 'Warning!', { timeOut: 2000, closeButton: true, disableTimeOut: false });
      }
    );

  }
}
