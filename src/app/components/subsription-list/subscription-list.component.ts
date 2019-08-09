import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CookieService } from 'ngx-cookie-service';
import { pipe } from '../../pipes/general-pipe/filter.model'
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-Subscription-list',
  templateUrl: './Subscription-list.component.html',
  styleUrls: ['./Subscription-list.component.css']
})
export class SubscriptionlistComponent implements OnInit {

  public nameSearch: pipe;
  exp;
public prevSubscription:any


  constructor(private cookieService:CookieService, private apiService: ApiService,  private route: ActivatedRoute) {

   
   }

 async ngOnInit() {
 
  this.prevSubscription = {'masterDetail' : {}}
  this.nameSearch = new pipe();

let userData = JSON.parse(this.cookieService.get("loginData"))
    try {
       
      let data = await this.apiService.get("organization-subscription-list/"+userData.user_id)
      this.prevSubscription = data.response
      for (let d = 0; d <   this.prevSubscription.previous.length; d++) {
        const element =   this.prevSubscription.previous[d];
         let createdDate = new Date (element.transaction.createdAt)
          createdDate.setMonth(createdDate.getMonth()+element.durations.month)
        
 this.prevSubscription.previous[d].expiredAt = createdDate
this.exp = createdDate;

   
        
      }
      if(this.prevSubscription.previous&&this.prevSubscription.previous.length>0){
        this.prevSubscription.previous.sort(($0,$1)=>{

          return new Date($1.transaction.createdAt).getTime()-new Date($0.transaction.createdAt).getTime()
        })
      }

    } catch (error) {
 
    }

  
    
    
  }


}
