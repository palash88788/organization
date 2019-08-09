import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class jobDetailComponent implements OnInit {
public jobs:any
public job_id : any;
  constructor(private cookieService:CookieService, private apiService: ApiService,  private route: ActivatedRoute,) {
    this.job_id = this.route.snapshot.params['id'];
   }

 async ngOnInit() {

let userData = JSON.parse(this.cookieService.get("loginData"))
    try {
       
      let data = await this.apiService.get("organization/job/"+this.job_id)
      this.jobs = data.response
      for (let v = 0; v < this.jobs.docs.length; v++) {
        const element = this.jobs.docs[v];
          const b = element.job_doc_url.split(".");
          if (b) {
            element.imageTag = b[b.length - 1]
          }
        
        this.jobs.docs[v] = element
      }

     //  this.router.navigateByUrl("pages/home")
      console.log( this.jobs)
    } catch (error) {
      console.log(error)
    }
    
  }

}
