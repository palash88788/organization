import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() user_id :String;
  constructor(private cookieService:CookieService, private router: Router, private route: ActivatedRoute) { }

 
  ngOnInit() {
  
    $('.toggle ,.toggle2,.overlay').click(function(){
      $('body').toggleClass('menu-show');
  })
  $('.sidebar ul li').click(function(){
    $('body').removeClass('menu-show');
});
  }
public logout(){
  try {
    if(!confirm("Are you sure you want to Logout"))
    return
    this.cookieService.delete('loginData',"/")
    this.router.navigateByUrl('');
    console.log(this.cookieService.get('loginData'))
  } catch (error) {
    console.log(error);
    
  }
 
// window.location.reload()
}
}