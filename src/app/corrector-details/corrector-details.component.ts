import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from '.././_models/page';
import { CommonService } from '.././_services/common.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: "app-corrector-details",
  templateUrl: "./corrector-details.component.html",
  styleUrls: ["./corrector-details.component.css"],
  encapsulation: ViewEncapsulation.None,
})

export class CorrectorDetailsComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  id: any;
  corrector = null;
  correctionList: Array<any> = [];
  page = new Page();
  p: number = 1;
  total: number = 0;

  constructor(private route: ActivatedRoute,
    private _service: CommonService) {

    this.page.pageNumber = 0;
    this.page.size = 10;
    this.id = this.route.snapshot.paramMap.get("id");

  }

  ngOnInit() {
    this.getList()
  }

  setPage(pageNumber) {
    this.page.pageNumber = pageNumber;
    this.getList();
  }

  getList() {
    const obj = {
      tutorId: this.id,
      projectId: 4,
      pageNumber: this.page.pageNumber,
      pageSize: this.page.size
    };

    this.blockUI.start("Getting Infromations...");
    this._service.get("/get-e-edu4-corrector-details/", obj).subscribe(
      (res) => {
        this.blockUI.stop();
        this.correctionList = [];
        res.list.forEach(element => {
          this.correctionList.push(element)
        });
        this.corrector = { name: res.name, profile_pic: res.profile_pic };

        this.page.pageTotalElements = this.correctionList.length;
        this.page.totalElements = res.total_count;
        this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);

      },
      (err) => {
        this.blockUI.stop();
      }
    );
  }
}
