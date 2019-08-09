import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from '../../services/api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public imageLoader:boolean = false;
  user_id
  public profile:any
  public social_medias : any;
  location:any
  socialMedia:any;
  public showList:boolean = false;
  constructor(private cookieService:CookieService, private apiService: ApiService,   private route: ActivatedRoute) {

   }

 async ngOnInit() {

  this.profile ={}
let userData = JSON.parse(this.cookieService.get("loginData"))
console.log(userData);

    try {
       
      let data = await this.apiService.get("organization/organization-info/"+userData.user_id)
      this.profile = data.response
      console.log(  this.profile.user_id);
      this.location = this.profile.locations
      this.socialMedia = this.profile.social_medias
        this.imageLoader = false;

  
        if (this.location == "" || this.socialMedia == "" ) {
          this.showList = true;
        }
      
    } catch (error) {
      console.log(error)
    }
    
  }

}
  

 


