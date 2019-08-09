import { Component, OnInit,Input } from '@angular/core';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-job-detail-sidebar',
  templateUrl: './job-detail-sidebar.component.html',
  styleUrls: ['./job-detail-sidebar.component.css']
})
export class jobDetailSidebarComponent implements OnInit {
@Input() job_id :String;
public isApply=false
  constructor(private cookieService:CookieService,private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

 
 async ngOnInit() {
try {
  let data = await this.apiService.get("organization/job/"+this.job_id)
  if(data.response.subscriptionDetail){
    if(data.response.subscriptionDetail.isMessenger==1){
      this.isApply=true
    }
  }
 
  console.log();
  
} catch (error) {
  
}

    
    $('.toggle ,.toggle2,.overlay').click(function(){
      $('body').toggleClass('menu-show');
  })
  $('.sidebar ul li').click(function(){
    $('body').removeClass('menu-show');
});
  }
public logout(){
  try {
    this.cookieService.delete('loginData',"/")
    this.router.navigateByUrl('');
    console.log(this.cookieService.get('loginData'))
  } catch (error) {
    console.log(error);
    
  }
 
// window.location.reload()
}
}