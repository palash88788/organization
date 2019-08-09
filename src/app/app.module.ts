import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { HomeComponent } from 'src/app/components/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './directives/footer/footer.component';
import { HeaderComponent } from './directives/header/header.component';
import { SidebarComponent } from './directives/sidebar/sidebar.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';

// import { ContactComponent } from './pages/contact/contact.component';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';
import { SimpleLayoutComponent } from './layout/simple-layout/simple-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ChatdeskComponent } from '../app/jobs/chat-desk/chat-desk.component';
import { ForgotPasswordComponent } from 'src/app/pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from 'src/app/pages/change-password/change-password.component';
import { JoblistComponent } from 'src/app/components/job-list/job-list.component';
import { PostjobComponent } from 'src/app/components/post-job/post-job.component';
// import { AuthGuardService } from './guards/auth-guard.service'
// import {AuthService} from './services/auth.service'
import { FormsService } from "./services/form-service";

import { HttpClientModule } from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Angular4PaystackModule } from 'angular4-paystack';

import { ApiService } from "./services/api";
import { CookieService } from 'ngx-cookie-service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AuthGuardService } from './services/auth-guard.service';
import { filterFormComponent } from 'src/app/components/filter-form/filter-form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatRadioModule} from '@angular/material/radio';

import {MatCheckboxModule} from '@angular/material/checkbox';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { profileUpdateComponent } from 'src/app/components/profile-update/profile-update.component';
import { ImageComponent } from 'src/app/directives/image/image.component';


import { jobDetailComponent } from 'src/app/jobs/job-detail/job-detail.component';
import { jobDetailSidebarComponent } from 'src/app/directives/job-detail-sidebar/job-detail-sidebar.component';
import { applicantsComponent } from 'src/app/jobs/applicants/applicants.component';
import { PersonSearchPipe } from '../app/pipes/general-pipe/module.filter.pipe';
import { SocketService } from 'src/app/services/socket.service';
import { JobUpdateComponent } from 'src/app/jobs/job-update/job-update.component';
import { AgmCoreModule } from '@agm/core';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { filterlistComponent } from 'src/app/components/filter-list/filter-list.component';
import { filterSidebarComponent } from 'src/app/directives/filter-sidebar/filter-sidebar.component';
import { filterDetailLayoutComponent } from 'src/app/layout/filter-detail-layout/filter-detail-layout.component';
import { filterDetailComponent } from 'src/app/filter/filter-detail/filter-detail.component';
import { applicantsFilterComponent } from 'src/app/filter/applicants-filter/applicants-filter.component';
import { ChatdeskFilterComponent } from 'src/app/filter/chat-desk-filter/chat-desk-filter.component';
import {FileUploadModule} from "ng2-file-upload";
import { FileUploadComponent } from 'src/app/directives/file-upload/file-upload.component';
import { Md5 } from 'ts-md5/dist/md5';
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { PhotoAlbum } from 'src/app/model/photo-album.service';
import { MessagingService } from 'src/app/services/messaging.service';
import * as firebase from 'firebase';
import { SubscriptionComponent } from 'src/app/pages/subscription/subscription.component';
import { dateFormatPipe } from 'src/app/pipes/general-pipe/date.filter.pipe';
import { SubscriptionlistComponent } from 'src/app/components/subsription-list/subscription-list.component';
import { jobDetailLayoutComponent } from 'src/app/components/Job-detail-layout/job-detail-layout.component';
import { JobApplicantPipe } from 'src/app/pipes/general-pipe/job-applicant.filter.pipe';
import { FilterListPipe } from 'src/app/pipes/general-pipe/filter-list.pipe';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service

firebase.initializeApp({
  apiKey: "AIzaSyDzm2IP5v6sAOjTe4_Dd7sIuQ32N8BpxAo",
  authDomain: "notifications-a6397.firebaseapp.com",
  databaseURL: "https://notifications-a6397.firebaseio.com",
  projectId: "notifications-a6397",
  storageBucket: "notifications-a6397.appspot.com",
  messagingSenderId: "110835973411",
});

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignUpComponent,
    HomeComponent,
    SidebarComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    SignInComponent,
    ChatdeskComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    JoblistComponent,
    PostjobComponent,
    filterFormComponent,
    ProfileComponent,
    profileUpdateComponent,
    ImageComponent,
    jobDetailComponent,
    jobDetailLayoutComponent,
    jobDetailSidebarComponent,
    applicantsComponent,
    PersonSearchPipe,
    JobUpdateComponent,
    filterlistComponent,
    filterSidebarComponent,
    filterDetailLayoutComponent,
    filterDetailComponent,
    applicantsFilterComponent,
    ChatdeskFilterComponent,
    FileUploadComponent,
    SubscriptionComponent,
    dateFormatPipe,
    SubscriptionlistComponent,
    JobApplicantPipe,
    FilterListPipe,

    
        
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,FormsModule,Angular4PaystackModule,
    GooglePlaceModule,
    HttpClientModule,BrowserAnimationsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    MatRadioModule,
    DatePickerModule,
    TimePickerModule,
    ChartsModule,
    FileUploadModule,
    MatCheckboxModule,
    MatSlideToggleModule,
   
    NgMultiSelectDropDownModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCTeop_aYmRMZCR67P-NKfvKlxoFyNt3z4',
      libraries: ["places"]
    }),
    
    CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'dgmepvauo' } as CloudinaryConfiguration),
   
  
  ],
  providers: [ApiService,FormsService,CookieService, AuthGuardService, SocketService, Md5, {provide: LocationStrategy, useClass: HashLocationStrategy}, PhotoAlbum, MessagingService,BnNgIdleService],
  bootstrap: [AppComponent]
})

export class AppModule   { }