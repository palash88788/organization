import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleLayoutComponent } from './layout/simple-layout/simple-layout.component';
import { FullLayoutComponent } from './/layout/full-layout/full-layout.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { ChatdeskComponent } from 'src/app/jobs/chat-desk/chat-desk.component';
import { ForgotPasswordComponent } from 'src/app/pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from 'src/app/pages/change-password/change-password.component';
import { JoblistComponent } from 'src/app/components/job-list/job-list.component';
import { PostjobComponent } from 'src/app/components/post-job/post-job.component';
// import { ContactComponent } from './pages/contact/contact.component';
import { AuthGuardService } from './services/auth-guard.service'
import { filterFormComponent } from 'src/app/components/filter-form/filter-form.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { profileUpdateComponent } from 'src/app/components/profile-update/profile-update.component';
import { ImageComponent } from 'src/app/directives/image/image.component';
import { jobDetailComponent } from './jobs/job-detail/job-detail.component';

import { applicantsComponent } from 'src/app/jobs/applicants/applicants.component';
import { JobUpdateComponent } from 'src/app/jobs/job-update/job-update.component';
import { filterlistComponent } from 'src/app/components/filter-list/filter-list.component';
import { filterSidebarComponent } from 'src/app/directives/filter-sidebar/filter-sidebar.component';
import { filterDetailLayoutComponent } from 'src/app/layout/filter-detail-layout/filter-detail-layout.component';
import { filterDetailComponent } from 'src/app/filter/filter-detail/filter-detail.component';
import { applicantsFilterComponent } from 'src/app/filter/applicants-filter/applicants-filter.component';
import { ChatdeskFilterComponent } from 'src/app/filter/chat-desk-filter/chat-desk-filter.component';
import { FileUploadComponent } from 'src/app/directives/file-upload/file-upload.component';
import { SubscriptionComponent } from 'src/app/pages/subscription/subscription.component';
import { SubscriptionlistComponent } from 'src/app/components/subsription-list/subscription-list.component';
import { jobDetailLayoutComponent } from 'src/app/components/Job-detail-layout/job-detail-layout.component';



const routes: Routes = [
  {
    path: 'pages',
    component: FullLayoutComponent,
    data: {
      title: 'pages'
    },
     canActivate:[AuthGuardService],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'post-job',
        component: PostjobComponent
      },
      {
        path: 'filter-form',
        component: filterFormComponent
      },
      {
        path: 'profile/:id',
        component: ProfileComponent
      },
      {
        path: 'profile-update/:id',
        component: profileUpdateComponent
      },
      {
        path: 'jobs',
        component: JoblistComponent
      },
      {
        path: 'image',
        component: ImageComponent
      },
      {
        path: 'filter-list',
        component: filterlistComponent
      },
      {
        path: 'subsription-list',
        component: SubscriptionlistComponent
      },
    
      
    
      
     
    ]
  },
  {
    path: '',
    component: SimpleLayoutComponent,
    data: {
      title: 'sign-in'
    },
    children: [
      {
        path: '',
        component: SignInComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'change-password/:message',
        component: ChangePasswordComponent
      },
      {
        path: 'sign-up',
        component: SignUpComponent
      },
      {
        path: 'subscription',
        component: SubscriptionComponent
      }
      

    ]
  },

  {
    path: 'jobs',
    component: jobDetailLayoutComponent,
    data: {
      title: 'jobs'
    },
    children: [
      {
        path: 'detail/:id',
        component: jobDetailComponent
      },
      {
        path: 'applicants/:id',
        component: applicantsComponent
      },
      {
        path: 'chat-desk/:id',
        component: ChatdeskComponent
      },
      {
        path: 'job-update/:id',
        component: JobUpdateComponent
      },
     
    ]
  },


  {
    path: 'filter',
    component: filterDetailLayoutComponent,
    data: {
      title: 'filter'
    },
    children: [
      {
        path: 'filter-detail/:id',
        component: filterDetailComponent
      },
      {
        path: 'applicants-filter/:id',
        component: applicantsFilterComponent
      },
      {
        path: 'chat-desk-filter/:id',
        component: ChatdeskFilterComponent
      },
      {
        path: 'file-upload',
        component: FileUploadComponent
      },
      

      
  
     
    ]
  },



];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
