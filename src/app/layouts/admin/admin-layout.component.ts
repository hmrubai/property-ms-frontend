import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { state, style, transition, animate, trigger, AUTO_STYLE } from '@angular/animations';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { AuthenticationService } from '../../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../_services/common.service';

export interface Options {
  heading?: string;
  removeFooter?: boolean;
  mapHeader?: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('mobileMenuTop', [
      state('no-block, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('yes-block',
        style({
          height: AUTO_STYLE,
        })
      ),
      transition('no-block <=> yes-block', [
        animate('400ms ease-in-out')
      ])
    ])
  ]
})

export class AdminLayoutComponent implements OnInit {
  deviceType = 'desktop';
  verticalNavType = 'expanded';
  verticalEffect = 'shrink';
  innerHeight: string;
  isCollapsedMobile = 'no-block';
  isCollapsedSideBar = 'no-block';
  toggleOn = true;
  windowWidth: number;
  
  lang;

  public htmlButton: string;

  public currentUser: any = {};

  constructor(
    public menuItems: MenuItems,
    public translate: TranslateService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private _service: CommonService,
  ) {
    const scrollHeight = window.screen.height - 150;
    this.innerHeight = scrollHeight + 'px';
    this.windowWidth = window.innerWidth;
    this.setMenuAttributs(this.windowWidth);

    this.currentUser = this.authService.currentUserDetails.value;

    this.translate.addLangs(['en', 'bn']);
    this.lang = localStorage.getItem('lang') || 'en';

    if (localStorage.getItem('lang') === this.lang) {
      this.translate.use(this.lang);
    }else if (localStorage.getItem('lang') !== this.lang) {
      localStorage.setItem('lang', this.lang);
      this.translate.use(this.lang);
    }

  }

  ngOnInit() {
    // if (this.authService.isAuthenticated()) {
    //   this.router.navigate(['/']);
    //   return;
    // }
  }

  changeLanguage(lang){
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this._service.currentLanguage.next(lang);
    console.log(lang)
  }

  onClickedOutside(e: Event) {
    if (this.windowWidth < 768 && this.toggleOn && this.verticalNavType !== 'offcanvas') {
      this.toggleOn = true;
      this.verticalNavType = 'offcanvas';
    }
  }

  onResize(event) {
    this.innerHeight = event.target.innerHeight + 'px';
    /* menu responsive */
    this.windowWidth = event.target.innerWidth;
    let reSizeFlag = true;
    if (this.deviceType === 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) {
      reSizeFlag = false;
    } else if (this.deviceType === 'mobile' && this.windowWidth < 768) {
      reSizeFlag = false;
    }

    if (reSizeFlag) {
      this.setMenuAttributs(this.windowWidth);
    }
  }

  setMenuAttributs(windowWidth) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.deviceType = 'tablet';
      this.verticalNavType = 'collapsed';
      this.verticalEffect = 'push';
    } else if (windowWidth < 768) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
    } else {
      this.deviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
    }
  }

  toggleOpened() {
    if (this.windowWidth < 768) {
      this.toggleOn = this.verticalNavType === 'offcanvas' ? true : this.toggleOn;
      this.verticalNavType = this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';
    } else {
      this.verticalNavType = this.verticalNavType === 'expanded' ? 'collapsed' : 'expanded';
    }
  }

  toggleOpenedSidebar() {
    this.isCollapsedSideBar = this.isCollapsedSideBar === 'yes-block' ? 'no-block' : 'yes-block';
  }

  onMobileMenu() {
    this.isCollapsedMobile = this.isCollapsedMobile === 'yes-block' ? 'no-block' : 'yes-block';
  }

  
  userLogout() {
    this.authService.logout(window.location.hostname);
    Cookie.delete('.PM.Cookie', '/', window.location.hostname);
    this.authService.currentUserDetails.next(null);
    this.router.navigate(['/login']);
    this.toastr.success('Logout Successfully', 'Success!', { timeOut: 2000 });
    this.router.navigate(["/login"]);
  }

  // userLogout() {
  //   this.authService.logout(window.location.hostname).subscribe(res => {
  //     if (res.Success) {
  //       Cookie.delete('.PM.Cookie', '/', window.location.hostname);
  //       // localStorage.removeItem('currentUser');
  //       this.authService.currentUserDetails.next(null);
  //       this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
  //       this.router.navigate(['/login']);
  //     } else {
  //       //this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
  //     }
  //   },
  //     error => { });

  // }

}
