import { Component, TemplateRef, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from './../_services/authentication.service';
import { CommonService } from './../_services/common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
HC_exporting(Highcharts);

@Component({
    selector: 'app-blood-request-con',
    templateUrl: './blood-request-con.component.html',
    styleUrls: ['./blood-request-con.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BloodRequestConComponent implements OnInit {

    public currentUser: any;
    submitted = false;
    bsConfig: Partial<BsDatepickerConfig>;
    @BlockUI() blockUI: NgBlockUI;
    entryForm: FormGroup;
    conObj:any;
    imgBaseUrl = environment.baseUrl;
    constructor(
        private authService: AuthenticationService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private router: Router,
        public formBuilder: FormBuilder,
        private _service: CommonService
    ) {
        this.authService.currentUserDetails.subscribe((value) => {
            this.currentUser = value;
          });
    }

    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],           
            is_active: [false]
      
      
          });
      
          this.getData();
        // this.bsConfig = {
        //     minDate: new Date()
        // }

        // this.getAllCount();
        // this.getMonthlyIncome();
        // this.getBuildingWiseRooms();
    }

    get f() {
        return this.entryForm.controls;
      }
  
      getData() {   
        this._service.get('config/get').subscribe(res => {
            this.conObj = res;
            this.entryForm.controls['is_active'].setValue(this.conObj.is_blood_for_staff);

        }, err => {
          this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });  
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
          id: this.conObj.id,
          is_blood_for_staff: this.entryForm.value.is_active,
        };
    
        this._service.post('config/update', obj).subscribe(
          data => {
            this.blockUI.stop();
            if (data.status == 'Ok') {
              this.toastr.success(data.message, 'Success!', { timeOut: 2000 });            
    
            } else {
              this.toastr.error(data.message, 'Error!', { timeOut: 2000 });
            }
          },
          err => {
            this.blockUI.stop();
            this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
          }
        );
    
      }

}
