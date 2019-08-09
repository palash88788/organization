import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css']
})
export class applicantsComponent implements OnInit {
  public nameSearch: any;
  public job
  public job_id : any;
public job_applications: any
jobDatas:any;
  userData
    constructor(private cookieService:CookieService, private apiService: ApiService,  private route: ActivatedRoute,) {
      this.job_id = this.route.snapshot.params['id'];
     }
  
   async ngOnInit() {

    this.nameSearch = {first_name : ""}
    console.log(this.nameSearch);
     this.job = {job_applications:[]}
  let userData = JSON.parse(this.cookieService.get("loginData"))
      try {
         
        let data = await this.apiService.get("organization/job/"+this.job_id)
        this.job = data.response
        this.jobDatas = this.job.job_applications
        console.log(this.jobDatas);
        
       //  this.router.navigateByUrl("pages/home")
        console.log( this.job)
      } catch (error) {
        console.log(error)
      }
      
    }

 

  async  onAccept(applicant){
    
      console.log(applicant)
      try {
        if(!confirm("Are you sure you want to Accept"))
        return
        let data = await this.apiService.post("adhoc/job-application",{job_id:applicant.job_id,
          user_id:applicant.user_id,
        status:2})
        location.reload()
      } catch (error) {
        
      }
        
    }
    async  onReject(applicant){
    
      console.log(applicant)
      try {
        if(!confirm("Are you sure you want to Reject"))
        return
        let data = await this.apiService.post("adhoc/job-application",{job_id:applicant.job_id,
          user_id:applicant.user_id,
         status:3})
         location.reload()
      } catch (error) {
        
      }
        
    }
  }