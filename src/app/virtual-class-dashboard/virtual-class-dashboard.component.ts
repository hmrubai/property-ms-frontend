import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-virtual-class-dashboard',
    templateUrl: './virtual-class-dashboard.component.html',
    styleUrls: ['./virtual-class-dashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class VirtualClassDashboardComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;
    Highcharts: typeof Highcharts = Highcharts;

    tutuorCallList = { list: [], total: 0 };
    tutorChartOptions: any;

    studentCallList = { list: [], total: 0 };
    studentChartOptions: any;

    id: any;
    constructor(
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
     this.id = this.route.snapshot.paramMap.get("id");
     this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    }
  

    ngOnInit() {
      this.getTutorCallList();
      this.getStudentCallList();
    }

    getTutorCallList() {

      this._service.get('getMeetingsDurationByTutorByProjectIdNew/' + this.id).subscribe(res => {

         this.tutuorCallList.list = [];
         let titles = [];
         this.tutorChartOptions = null;

         res.forEach(element => {
            // this.tutuorCallList.list.push(element);
            this.tutuorCallList.list.push({
               name: element.name,
               y: Number(element.duration)

            })

         });
         res.forEach(element => {
            titles.push(element.name)
         });

         //this.tutuorCallList.total = this.tutuorCallList.list.length;

         this.tutorChartOptions = {
            chart: {
               type: 'bar',
               plotAreaWidth: 30,
               scrollablePlotArea: {
                  minHeight: 1000
              },
              marginRight: 30
            },
            title: {
               text: 'Call duration of tutor'
            },
            xAxis: {
               categories: titles, labels: {
                  style: {
                     //   fontSize: '10px',
                     //   fontFamily: 'Verdana, sans-serif',
                     fontStyle: 'italic',
                     fontWidth: "2px"
                  },
               },

            },
            yAxis: {
               min: 0,
               title: {
                  text: 'Class Duration(hour) ',
                  align: 'middle'
               },
            },
            legend: {
               enabled: false
            },
            plotOptions: {
               bar: {
                 
                  dataLabels: {
                     enabled: true,
                     inside: false,
                     borderRadius: 4,
                     backgroundColor: 'rgba(252, 255, 197, 0.7)',
                     borderWidth: 1,
                     borderColor: '#AAA',
                     y: -6,
                     filter: {
                         property: 'y',
                         operator: '>',
                         value: 0
                     }
                 }
               }
            },
            series: [{
               name: 'Class Duration(hour)',
               data: this.tutuorCallList.list
            }],

            center: [100, 80],
            size: 100,
          
         }

      }, err => {
         this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
      );
   }
   getStudentCallList() {
    

      this._service.get('getMeetingsDurationOfStudentByProjectIdNew/' + this.id).subscribe(res => {

         this.studentCallList.list = [];
         let titles = [];
         this.studentChartOptions = null;

         res.forEach(element => {
            // this.tutuorCallList.list.push(element);
            this.studentCallList.list.push({
               name: element.name,
               y: Number(element.duration)

            })

         });
         res.forEach(element => {
            titles.push(element.name)
         });

         //this.tutuorCallList.total = this.tutuorCallList.list.length;

         this.studentChartOptions = {
            chart: {
               type: 'bar',
               plotAreaWidth: 30,
               scrollablePlotArea: {
                  minHeight: 1000
              },
              marginRight: 30
            },
            title: {
               text: 'Call duration of student'
            },
            xAxis: {
               type: 'category',
               categories: titles,
               scalable: true,
              
               scrollbar: {
                   enabled: true,
               },
            },
            yAxis: {
               min: 0,
               title: {
                  text: 'Class Duration(hour) ',
                  align: 'middle'
               },
               scrollbar: {
                  enabled: true
              },
            },
            credits: {
               enabled: false
           },
            legend: {
               enabled: false
            },
            plotOptions: {
               bar: {
                 
                  dataLabels: {
                     enabled: true,
                     inside: false,
                     borderRadius: 4,
                     backgroundColor: 'rgba(252, 255, 197, 0.7)',
                     borderWidth: 1,
                     borderColor: '#AAA',
                     y: -6,
                     filter: {
                         property: 'y',
                         operator: '>',
                         value: 0
                     }
                 }
               }
            },
            series: [{
               name: 'Class Duration(hour)',
               data: this.studentCallList.list,
               //pointWidth: 15,
            },
            ],

          
         }

      }, err => {
         this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
      );
   }
  
   
}
