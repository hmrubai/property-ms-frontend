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
import { CalendarOptions } from '@fullcalendar/angular';
// HC_exporting(Highcharts);

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {

    public currentUser: any;
    public allContent: any;
    public buildingWiseRooms: any;
    public allocationRoomDetails: any;
    public floorRooms: any;
    approvedTutor: Number = 0;
    pendingTutor: Number = 0;
    holdTutor: Number = 0;
    suspendTutor: Number = 0;
    guardian: Number = 0;
    hiredTutor: Number = 0;
    submitted = false;
    bsConfig: Partial<BsDatepickerConfig>;

    Highcharts: typeof Highcharts = Highcharts;

    tutuorCallList = { list: [], total: 0 };
    tutorChartOptions: any;

    vacancRate = { list: [], total: 0 };
    vacancRateOptions: any;

    is_loaded = false;

    property_id;

    propertyDetails = {
        id: null,
        name: null,
        address: null,
        completion_date_of_construction: null,
        total_floor_space: null,
        total_floor_space_for_rent: null,
        image: null
    };

    propertyList = [
        {
            id: 1,
            name: "Tulip Palace",
            address: "82/A, Dhaka, Bangladesh",
            completion_date_of_construction: "16th April, 2022",
            total_floor_space: "1800",
            total_floor_space_for_rent: "1800",
            image: "property1.jpg"
        },
        {
            id: 2,
            name: "Rose Garden Palace",
            address: "Banasree, Dhaka, Bangladesh",
            completion_date_of_construction: "12th April, 2022",
            total_floor_space: "2100",
            total_floor_space_for_rent: "2000",
            image: "property2.jpg"
        }
    ];

    searchForm: FormGroup;

    modalConfig: any = {
        class: 'gray modal-xl',
        backdrop: 'static'
    };
    modalRef: BsModalRef;


    modalTitle = 'Allocation Details';
    btnSaveText = 'Close';

    imgBaseUrl = environment.baseUrl;

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        // dateClick: this.handleDateClick.bind(this), // bind is important!
        events: [
          { title: 'New InFlash Meeting', date: '2022-04-19' },
          { title: 'InFlash Meet Up', date: '2022-04-22' }
        ]
    };

    getMonthlyPayment = [];
    courseOptions: any = null;
    highcharts = Highcharts;
    @BlockUI() blockUI: NgBlockUI;
    printableCollections = 0;
    constructor(
        private authService: AuthenticationService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private router: Router,
        public formBuilder: FormBuilder,
        private _service: CommonService
    ) {
        this.currentUser = this.authService.currentUserDetails.value;
        //console.log(this.currentUser)
    }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            Date: [new Date()],
        });
        this.getTutorCallList();
    }

    get f() {
        return this.searchForm.controls;
    }

    changeProperty(propertyId){
        console.log(propertyId)
        this.is_loaded = false;

        this.propertyList.forEach(element => {
            if(element.id == this.property_id){
                this.propertyDetails = null;
                this.propertyDetails = {
                    id: element.id,
                    name: element.name,
                    address: element.address,
                    completion_date_of_construction: element.completion_date_of_construction,
                    total_floor_space: element.total_floor_space,
                    total_floor_space_for_rent: element.total_floor_space_for_rent,
                    image: element.image
                };
                this.is_loaded = true;
            }
         });
    }

    handleDateClick(arg) {
        console.log('date click! ' + arg.dateStr);
        //alert('date click! ' + arg.dateStr)
    }

    getTutorCallList() 
    {
        this.tutuorCallList.list = [];
        let titles = [];
        this.tutorChartOptions = null;

        let newdata = [
            {"name":"January","duration":"33.62"},
            {"name":"February","duration":"36.96"},
            {"name":"March","duration":"32.47"},
            {"name":"April","duration":"40.37"},
            {"name":"May","duration":"39.76"},
            {"name":"June","duration":"24.09"},
            {"name":"July","duration":"40.10"},
            {"name":"August","duration":"12.31"},
            {"name":"September","duration":"26.41"},
            {"name":"October","duration":"19.41"}
        ]

        newdata.forEach(element => {
            this.tutuorCallList.list.push({
                name: element.name,
                y: Number(element.duration)

            })

        });
        newdata.forEach(element => {
            titles.push(element.name)
        });

        this.tutorChartOptions = {
            chart: {
                type: 'column',
                plotAreaWidth: 30,
                scrollablePlotArea: {
                minHeight: 1000
            },
            marginRight: 30
            },
            title: {
                text: 'Monthly Trends (Income, Cost, Profit)'
            },
            xAxis: {
                categories: titles, labels: {
                style: {
                    fontStyle: 'italic',
                    fontWidth: "2px"
                },
                },

            },
            yAxis: {
                min: 0,
                title: {
                text: 'Income, Cost, Profit',
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
                name: 'Profit',
                data: this.tutuorCallList.list
            }],

            center: [100, 80],
            size: 100,
        };

        this.vacancRate.list = [];
        let titles_new = [];
        this.vacancRateOptions = null;

        let ratedata = [
            {"name":"January","duration":"33.62"},
            {"name":"February","duration":"36.96"},
            {"name":"March","duration":"32.47"},
            {"name":"April","duration":"40.37"},
            {"name":"May","duration":"39.76"},
            {"name":"June","duration":"24.09"},
            {"name":"July","duration":"40.10"},
            {"name":"August","duration":"12.31"},
            {"name":"September","duration":"26.41"},
            {"name":"October","duration":"19.41"}
        ]

        ratedata.forEach(element => {
            this.vacancRate.list.push({
                name: element.name,
                y: Number(element.duration)

            })

        });
        ratedata.forEach(element => {
            titles_new.push(element.name)
        });

        this.vacancRateOptions = {
            chart: {
                type: 'column',
                plotAreaWidth: 30,
                scrollablePlotArea: {
                minHeight: 1000
            },
            marginRight: 30
            },
            title: {
                text: 'Monthly Trends (Vacancy Rate)'
            },
            xAxis: {
                categories: titles_new, labels: {
                style: {
                    fontStyle: 'italic',
                    fontWidth: "2px"
                },
                },

            },
            yAxis: {
                min: 0,
                title: {
                text: 'Rate',
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
                name: 'Rate',
                data: this.vacancRate.list
            }],

            center: [100, 80],
            size: 100,
        };





     }

    getCounts() {
        this._service.get('/getUsersNumber').subscribe(res => {

            this.approvedTutor = res.tutorApprovedNumber;
            this.pendingTutor = res.tutorPendingNumber;
            this.holdTutor = res.tutorOnHoldNumber;
            this.suspendTutor = res.tutorSuspendedNumber;
            this.guardian = res.guardianNumber;
            this.hiredTutor = res.hiredTutorNumber;
        }, err => {
            this.toastr.warning(err.Messaage || err, 'Warning!', {
                closeButton: true,
                disableTimeOut: false
            });
        });
    }

    /*getMonthlyIncome() {
        this._service.get('dashboard/get-monthly-payment_and_collection').subscribe(res => {
            this.getMonthlyPayment = res.Record;
            this.calculateIncomeCollection(this.getMonthlyPayment)
        }, err => { });
    }

    getBuildingWiseRooms() {
        const obj = {
            date: moment(this.searchForm.value.Date).format('DD-MMM-YYYY')
        };
        this._service.get('dashboard/get-building-wise-rooms', obj).subscribe(res => {
            this.buildingWiseRooms = res.Records;
            console.log(this.buildingWiseRooms[0].Floors);
            this.floorRooms = this.buildingWiseRooms[0].Floors;
        }, err => { });
    }

    calculateIncomeCollection(getMonthlyPayment) {
        let printableReceivables = 0;

        let totalCollections = getMonthlyPayment.Collections;
        let totalReceivables = getMonthlyPayment.Receivables;

        totalCollections.forEach(item => {
            this.printableCollections = this.printableCollections + item;
        });

        totalReceivables.forEach(item => {
            printableReceivables = printableReceivables + item;
        });
    }

    getAllocationDetails(room, template: TemplateRef<any>) {
        const obj = {
            id: room.Id,
            allocatedDate: moment(this.searchForm.value.Date).format('DD-MMM-YYYY')
        };
        this._service.get('room/get-allocation-details', obj).subscribe(res => {
            this.allocationRoomDetails = res.Record;
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => { });
    }

    getCourseEnrollmentCount() {
        const self = this;
        this._service.get("Course/GetCourseEnrollmentCount")
            .subscribe(
                res => {

                    if (!res.Success) {
                        this.toastr.error(res.message, 'Error!', {
                            timeOut: 2000
                        });
                        return;
                    }
                    let dataArr = [];
                    let nameArr = [];

                    res.Records.forEach((element) => {
                        nameArr.push(element.Title);
                        dataArr.push({
                            'y': element.Count,
                            'name': element.Title,
                            'id': element.Id
                        });
                    });

                    this.courseOptions = {
                        chart: {
                            type: "column",
                            scrollablePlotArea: {
                                minWidth: 700,
                                scrollPositionX: 1
                            }
                        },
                        exporting: {
                            buttons: {
                                contextButton: {
                                    menuItems: [{
                                        "textKey": "printChart",
                                        onclick: function () {
                                            this.print();
                                        }
                                    }, {
                                        "separator": true
                                    }, {
                                        "text": "Download Excel",
                                        onclick: function () {
                                            self.downloadExcelFile();
                                        }
                                    }, {
                                        "separator": true
                                    }, {
                                        "textKey": "downloadPNG",
                                        onclick: function () {
                                            this.exportChart();
                                        }
                                    }, {
                                        "textKey": "downloadJPEG",
                                        onclick: function () {
                                            this.exportChart({
                                                type: 'image/jpeg'
                                            });
                                        }
                                    }, {
                                        "textKey": "downloadPDF",
                                        onclick: function () {
                                            this.exportChart({
                                                type: 'application/pdf'
                                            });
                                        }
                                    }, {
                                        "textKey": "downloadSVG",
                                        onclick: function () {
                                            this.exportChart({
                                                type: 'image/svg+xml'
                                            });
                                        }
                                    }]
                                }
                            },
                            //  fallbackToExportServer: false
                        },
                        title: {
                            text: "Course Wise Enrolled Employees"
                        },
                        xAxis: {
                            categories: nameArr,
                            labels: {
                                rotation: -45,
                                style: {
                                    fontSize: '12px',
                                    fontFamily: 'Verdana, sans-serif'
                                },
                                overflow: 'justify'

                            },
                            title: {
                                text: "Course(s)"
                            }
                        },

                        yAxis: {
                            labels: {
                                format: '{value}'
                            },
                            title: {
                                text: "No Of Employee Enrolled"
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            area: {
                                fillOpacity: 0.5
                            },
                            series: {
                                borderWidth: 0,
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function (event) {
                                            console.log(event.point.options);
                                            self.router.navigate(['/course-details-dashboard', event.point.options.id]);
                                            //this.filter.emit([this.category, this.serie.name]);
                                            // alert('Name: '+ this.category + ', Value: ' + this.y + ', Series :' + this.series.name);
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            // headerFormat:
                            //   '<span style="font-size:11px">{series.name}</span><br>',
                            pointFormat: '<b>{point.y} employee(s) have been enrolled </b>'
                        },

                        series: [{
                            name: "Watched Duration",
                            data: dataArr,
                            dataLabels: {
                                enabled: true,
                                rotation: -90,
                                color: '#FFFFFF',
                                align: 'right',
                                format: '{point.y}', // one decimal
                                y: 20, // 10 pixels down from the top
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        }]
                    };
                },
                err => { }
            );
    }

    onPointSelect($event) {
        console.log($event);
    }

    downloadExcelFile() {

        this.blockUI.start('Generating report. Please wait...');
        this._service.downloadFile('Course/GetCourseEnrollmentCountExcel').subscribe(res => {
            this.blockUI.stop();
            const url = window.URL.createObjectURL(res);
            var link = document.createElement('a');
            link.href = url;
            link.download = "Course_Wise_Enrolled_Employees_Report.xlsx";
            link.click();

        },
            error => {
                this.blockUI.stop();
            });
    }

    fixDate(d: Date): Date {
        d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
        return d;
    }

    getDateTimeFormat(value: Date) {
        return moment(value).format('DD-MMM-YYYY hh:mm A');
    }

    modalHide() {
        this.modalRef.hide();
    }

    openModal(room, template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }*/
}
