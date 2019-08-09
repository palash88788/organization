
import { ElementRef, Component,NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from "@angular/router";
import { ApiService } from '../../services/api';
import * as $ from 'jquery';
import { FormsService } from "./../../services/form-service";
import { CookieService } from 'ngx-cookie-service';
import { Subject } from "rxjs";
import { dispatch } from 'rxjs/internal/observable/range';
import {} from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
@Component({
  selector:  'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class profileUpdateComponent implements OnInit {
  submitted = false;
  profileA;
  message:any;
  public parentSubject = new Subject()
  public imageLoader:boolean = false;
  public userData:any
  public social_medias:Array<{"social_media":string,"social_url":string}>
  display2='none'; 
  profile:any;
public locationAddress:any;
lat: number;
lon: number;
address:any;
city:any;
state:any;
country:any;
places:any; 
id:any;
public deleteSocialMediaID:Array<any>
public locations: Array<any>
public serverSocialMedias:Array<any>
public deleteSocialMedias: Array<any>
public socialMedias: Array<any>
public latitude: number;  
public longitude: number;                                                                                                                   
public zoom: number;                                                      
@ViewChild('search',{static:true})
public searchElementRef: ElementRef;

autoCompleteCallback(selectedData: any) {
  this.lat = selectedData.data.geometry.address.lat;
  this.lon = selectedData.data.geometry.location.lng;
  this.address = selectedData.data.formatted_address;
  console.log(this.lat);
}

  constructor(private formBuilder: FormBuilder,private cookieService:CookieService,private router: Router,public formService:FormsService,private apiService: ApiService,  private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {

 
   }

  ngOnInit() {
  
  //  this.getProfileData();
let user = JSON.parse(this.cookieService.get("loginData"))

this.socialMedias = []
this.deleteSocialMedias = []
this.userData = user

this.profile = {organization_info:{}}

this.profileView()


this.mapsAPILoader.load().then(() => {
  let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    types: ["address"]
  });
  console.log(autocomplete);
  autocomplete.addListener("place_changed", () => {
    this.ngZone.run(() => {
      //get the place result
      let place: google.maps.places.PlaceResult = autocomplete.getPlace();
      console.log(place)       
     
      //verify result
      if (place.geometry === undefined || place.geometry === null) {
        return;
      }
    
      this.city =this.findResult(place.address_components,"administrative_area_level_2")
      this.state =this.findResult(place.address_components,"administrative_area_level_1")
      this.country = this.findResult(place.address_components,"country")
      console.log(place)                                                              
      this.address = place.formatted_address
      //set latitude, longitude and zoom
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.zoom = 12;
      if(this.profile.locations&&this.profile.locations.length>0){
        this.profile.locations[0] =Object.assign( this.profile.locations[0],{
          lat: this.latitude,
          lon: this.longitude,
          address:this.address,
          city:this.city,
          state:this.state,
          country:this.country
        })
      }else{
        this.profile.locations=[]
        this.profile.locations.push({
          lat: this.latitude,
          lon: this.longitude,
          address:this.address,
          city:this.city,
          state:this.state,
          country:this.country
        })
      }
    
      
      console.log(this.latitude)
      console.log(this.longitude)
    });
  });
});

  }

  public findResult = function (results, name) {
    
    const result = results.find(function (obj) {
      return obj.types[0] === name;
      
    });
    return result ? result.long_name : null;
   
  };


public addSocialMedia () {
  this.social_medias.push({"social_media":"","social_url":""})
}
public removeSocialMedia (index,item) {
  // this.social_medias.splice( i ,1)
  console.log(index,item)
  let s =this.serverSocialMedias.find(t=>t.id==item.id)
  if(s){
    console.log(s)
    this.deleteSocialMedias.push(s)
    console.log(this.deleteSocialMedias);
  }
  this.social_medias.splice(index, 1);
}



     async profileView() {

    try {

      let data = await this.apiService.get("organization/organization-info/"+this.userData.user_id)
      this.profile = data.response
      this.parentSubject.next(this.profile.avatar_image)
      this.serverSocialMedias = []
      if(this.profile .social_medias){
        this.socialMedias =this.profile .social_medias
          this.serverSocialMedias = this.socialMedias
      }
  
      this.social_medias=[]
      for(var i=0;i<this.profile.social_medias.length;i++){
     
      this.social_medias.push(this.profile.social_medias[i])
    }
    for (let a = 0; a < this.profile.locations.length; a++) {
      this.locationAddress = this.profile.locations[a].address
    }
    } catch (error) {
      console.log(error)
    }
    
  }

  async onSubmit() {

    this.profile.social_medias = []
    console.log(this.profile);


    this.deleteSocialMediaID=[]
    for (let b = 0; b < this.deleteSocialMedias.length; b++) { 
       this.deleteSocialMedias[b].id = this.deleteSocialMedias[b].id  
       this.deleteSocialMediaID.push(this.deleteSocialMedias[b].id) 
        console.log(this.deleteSocialMedias[b].id)}
        this.profile.deleteSocials = this.deleteSocialMediaID

    for(var i=0;i<this.social_medias.length;i++){
      this.profile.social_medias.push(Object.assign(this.social_medias[i],{user_id:this.userData.user_id}))
    }
   
    try {
     
      let data = await this.apiService.post("organization/organization-info", this.profile)
      console.log(data)
 
      this.imageLoader = false;
      if(data.success == true){
        this.message = data.response
        this.display2='block'
     
        console.log(this.message);
    
      }
     
    } catch (error) {
      console.log(error.error);
    }

  }

  public changeAvatarImage(event){

    for (let l = 0; l < event.thumbnail.length; l++) {
      const element =event.thumbnail[l];

         this.profile.avatar_image = element.data.secure_url;
      
    }
  }

  
  hidePop()
{
  this.router.navigate(['pages/profile', this.profile.user_id]);
}
}
