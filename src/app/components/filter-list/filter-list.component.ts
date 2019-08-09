import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CookieService } from 'ngx-cookie-service';
import { pipe } from '../../pipes/general-pipe/filter.model'
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.css']
})
export class filterlistComponent implements OnInit {

  public nameSearch: any;
  user_id
public filterList:Array<any>


  constructor(private cookieService:CookieService, private apiService: ApiService,  private route: ActivatedRoute) {
    this.user_id = this.route.snapshot.params['user_id'];
   }

 async ngOnInit() {
  this.nameSearch = {title : ""}

let userData = JSON.parse(this.cookieService.get("loginData"))
    try {
       
      let data = await this.apiService.get("organization/organization/"+userData.user_id)
      this.filterList = data.response
 
      console.log(this.filterList)
    } catch (error) {
 
    }

  
    
    
  }


}
