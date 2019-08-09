import { ElementRef, Component,NgZone, OnInit,ViewChild } from '@angular/core';
import { FormsService } from "./../../services/form-service";
import { Router } from "@angular/router";
import { ApiService } from '../../services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MapsAPILoader } from '@agm/core';
// import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css']
})
export class PostjobComponent implements OnInit {
  message:any;
  public minDate: Date = new Date ("05/07/2017");
  public maxDate: Date = new Date ("05/27/2017");
  public dateValue: Date = new Date ("05/16/2017");
  display2='none';  
  public JobPostForm: FormGroup;
  public submitted = false;
  public minStartDate = new Date()
public minEndDate = new Date()
public maxDeadLineDate = new Date()
dropdownSettingsInterest = {};
item1;
address:any;
public latitude: number;  
public longitude: number;                                                                                                                   
public zoom: number;  
interests =[];
listdata =[];
public docs:any = [];
@ViewChild('search',{static:true})
public searchElementRef: ElementRef;

autoCompleteCallback(selectedData: any) {

}

  constructor(private formBuilder: FormBuilder,private cookieService:CookieService, private router: Router,public  formService:FormsService,private apiService: ApiService, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }
  ngOnInit() {

    this.Interest();
    var user  = JSON.parse(this.cookieService.get("loginData"))

    this.JobPostForm = this.formBuilder.group({
      job_type: ['', Validators.required],
      job_name: ['', Validators.required],
      address: ['', Validators.required],
      lat: [25.75, [Validators.required]],
      lon: [75.25, [Validators.required]],
      city: ['Indore'],
      state: ['MP'],
      country: ['India'],
      job_start_date: [''],
      job_end_date: [''],
      interview_start_time: [''],
      interview_end_time: [''],
      application_deadline:[''],
      no_applicants_required:['',[Validators.required]],
      advert_type: [1, Validators.required],
      desc: ['', Validators.required],
      no_applicants_applied: ["0", Validators.required],
      status: [1, Validators.required],
      organization_id:[user.user_id],
      interests:['',Validators.required],
      doc_url: ['']

    })
    // console.log(this.JobPostForm)

  

    this.JobPostForm.get('job_start_date').valueChanges.subscribe((value)=>{
      this.minEndDate =value
    })
    this.JobPostForm.get('job_end_date').valueChanges.subscribe((value)=>{
      this.maxDeadLineDate =value
    })


    this.dropdownSettingsInterest = {
      singleSelection: false,
      idField: 'interest_id',
      textField: 'interest_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll:false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

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
        
          const city =this.findResult(place.address_components,"administrative_area_level_2")
          const state =this.findResult(place.address_components,"administrative_area_level_1")
          const country = this.findResult(place.address_components,"country")
          console.log(place)                                                              
          this.address = place.formatted_address
          //set latitude, longitude and zoom
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.JobPostForm.patchValue({address:this.address,city:city,state:state,country:country,lat:latitude,lon:longitude})

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

  async onRegister(){
    this.submitted = true;
     this.JobPostForm.value.docs  = this.docs;
  
     try {
      let data = await this.apiService.post("organization/add-job", this.JobPostForm.value)
      if(data.success == true){
        this.message = data.response
        this.display2='block'
      
        console.log(this.message);
        
      }
     
      // this.router.navigateByUrl('pages/jobs');
     //  this.router.navigateByUrl("pages/home")
      console.log(data)
    } catch (error) {
      console.log(error)
    }
    
   }
public handleAddressChange(places){
  console.log(places)
}

onItemSelectInterest(item: any) {
   
  this.item1 = item.interest_id
 console.log(this.item1);
 
  
  this.interests.push(this.item1);
 console.log(this.interests);
 
  
}


// ===================Interest Api===========
   
async Interest(){
    
  this.submitted = true;
  
   try {
    
   let data = await this.apiService.get("admin/master/interest")
  

     this.listdata = data.response;
  
  
  } catch (error) {
    
  }
  
 }

 changeAttachment($event): void {
console.log($event);
  this.docs = [];
    for (let l = 0; l < $event.thumbnail.length; l++) {
      const element = $event.thumbnail[l];
  
      
      this.docs.push({
        doc_url:element.data.secure_url,
        public_id:element.data.public_id
      })
 
      
    }
  

}



hidePop()
{
  this.router.navigate(['pages/jobs']);
}

}

