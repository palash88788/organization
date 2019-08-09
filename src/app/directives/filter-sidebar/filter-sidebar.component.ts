import { Component, OnInit,Input } from '@angular/core';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.css']
})
export class filterSidebarComponent implements OnInit {
@Input() filter_id :String;
  constructor(private cookieService:CookieService,private apiService:ApiService, private router: Router, private route: ActivatedRoute) { }
public isApply = false
 
  async ngOnInit() {

    try {
      let data = await this.apiService.get("organization/organization-filter/"+this.filter_id)
      if(data.response.search_response.subscriptionDetail){
        if(data.response.search_response.subscriptionDetail.isMessenger==1){
          this.isApply=true
        }
      }
     
      console.log();
      
    } catch (error) {
      
    }




console.log(this.filter_id);

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