import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { ToggleFullscreenDirective } from './fullscreen/toggle-fullscreen.directive';
import {CardRefreshDirective} from './card/card-refresh.directive';
import {CardToggleDirective} from './card/card-toggle.directive';
import { CardComponent } from './card/card.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {ParentRemoveDirective} from './elements/parent-remove.directive';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from '../spinner/spinner.component';
import {GoTopButtonModule} from 'ng-go-top-button';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {TagInputModule} from 'ngx-chips';
import {ClickOutsideModule} from 'ng-click-outside';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { NumericDirective } from '../_helpers/numbers-only';
import { BlockUIModule } from 'ng-block-ui';
import { MomentModule } from 'ngx-moment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { UploadDialogComponent } from './../_helpers/upload-dialog/dialog.component';
import { UploadService } from './../_services/upload.service';
// import { UiSwitchModule } from 'ngx-toggle-switch';
import { UiSwitchModule } from 'ngx-ui-switch';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { TruncatePipe } from '../_helpers/truncate-pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';

// import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
// import { NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
// import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';

import {NgxPaginationModule} from 'ngx-pagination';
// import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      PaginationModule.forRoot(),
      SimpleNotificationsModule.forRoot(),
      TagInputModule,
      ClickOutsideModule,
      GoTopButtonModule,
      NgxDatatableModule,
      ModalModule.forRoot(),
      BlockUIModule.forRoot(),
      BsDatepickerModule.forRoot(),
      TabsModule.forRoot(),
      TimepickerModule.forRoot(),
      TooltipModule.forRoot(),
      // NgxMatDatetimePickerModule,
    //   NgxMatTimepickerModule,
      NgSelectModule,
      UiSwitchModule,
      FlexLayoutModule,

    //   MatCheckboxModule,
      // MatDatepickerModule,
      MatInputModule,
    //   MatRadioModule,
    //   MatSelectModule,
    //   NgxMatMomentModule,
      MatButtonModule,
      MatDialogModule,
       MatListModule,
       MatProgressBarModule,
      NgxPaginationModule,
      // NgxEditorModule
  ],
  declarations: [
      AccordionAnchorDirective,
      AccordionLinkDirective,
      AccordionDirective,
      ToggleFullscreenDirective,
      CardRefreshDirective,
      CardToggleDirective,
      ParentRemoveDirective,
      NumericDirective,
      CardComponent,
      SpinnerComponent,
      UploadDialogComponent,
      TruncatePipe
  ],
  entryComponents: [UploadDialogComponent],
  exports: [
      AccordionAnchorDirective,
      AccordionLinkDirective,
      AccordionDirective,
      ToggleFullscreenDirective,
      CardRefreshDirective,
      CardToggleDirective,
      ParentRemoveDirective,
      NumericDirective,
      CardComponent,
      SpinnerComponent,
      PaginationModule,
      FormsModule,
      ReactiveFormsModule,
      SimpleNotificationsModule,
      TagInputModule,
      ClickOutsideModule,
      GoTopButtonModule,
      NgxDatatableModule,
      ModalModule,
      MomentModule,
      TabsModule,
      NgSelectModule,
      BlockUIModule,
      UiSwitchModule,
      FlexLayoutModule,
      BsDatepickerModule,
      TimepickerModule,
      // NgxMatDatetimePickerModule,
    //   NgxMatTimepickerModule,
      TruncatePipe,
      TooltipModule,
    //   MatCheckboxModule,
      // MatDatepickerModule,
      MatInputModule,
    //   MatRadioModule,
    //   MatSelectModule,
    //   NgxMatMomentModule,
      MatButtonModule,
      MatDialogModule,
      MatListModule,
      MatProgressBarModule,
      NgxPaginationModule,
      // NgxEditorModule

  ],
  providers: [
      MenuItems,
      UploadService
  ]
})
export class SharedModule { }
