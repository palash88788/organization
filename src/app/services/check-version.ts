



import { Injectable,OnInit } from "@angular/core";
import { ApiService } from './api';
import { async } from "@angular/core/testing";
@Injectable({
  providedIn: "root"
})
export class CheckVersionService implements OnInit {
   
//   private _url = "http://192.168.1.12:4000/v1/";
  private _url = "http://52.41.249.74:4000/v1/";
constructor(private apiService:ApiService){}
 
async ngOnInit(){


 try {
     setInterval(async() => { 
        let user_type = 2
  
        let data = await this.apiService.get("app-version/" + user_type)
        console.log(data.response.app_version);
        
         if(data.response.app_version!='1.0.0'){
                window.location.reload(true)
         }
     }, 30000);
 } catch (error) {
     
 }
}


}