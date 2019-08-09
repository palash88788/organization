import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-filter-detail',
  templateUrl: './filter-detail.component.html',
  styleUrls: ['./filter-detail.component.css']
})
export class filterDetailComponent implements OnInit {
public filterDetail:any
public filter_id : any;
searchData:any;
  constructor(private cookieService:CookieService, private apiService: ApiService,  private route: ActivatedRoute,) {
    this.filter_id = this.route.snapshot.params['id'];
   }

 async ngOnInit() {

let userData = JSON.parse(this.cookieService.get("loginData"))
    try {
       
      let data = await this.apiService.get("organization/organization-filter/"+this.filter_id)
      this.filterDetail = data.response
     this.searchData = this.filterDetail.search_response
     //  this.router.navigateByUrl("pages/home")
      console.log( this.filterDetail)
    } catch (error) {
      console.log(error)
    }
    
  }

}
