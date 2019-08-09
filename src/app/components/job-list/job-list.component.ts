import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CookieService } from 'ngx-cookie-service';
import { pipe } from '../../pipes/general-pipe/filter.model'
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { all } from 'q';
// import { reverse } from 'dns';
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JoblistComponent implements OnInit {
  public nameSearch: pipe;
  user_id
public jobs:Array<any>


  constructor(private cookieService:CookieService, private apiService: ApiService,  private route: ActivatedRoute) {
    this.user_id = this.route.snapshot.params['user_id'];
   }

 async ngOnInit() {
  this.nameSearch = new pipe();

let userData = JSON.parse(this.cookieService.get("loginData"))
    try {
       
      let data = await this.apiService.get("organization/jobs/"+userData.user_id)
      this.jobs = data.response
     //  this.router.navigateByUrl("pages/home")
      console.log( this.jobs)
    } catch (error) {
      console.log(error)
    }

  
    
    
  }

  removeModel(){
    $('body').removeClass('.modal-open');

  }


}
