import { ElementRef, Component,NgZone, OnInit, ViewChild  } from '@angular/core';
import { ApiService } from '../../services/api';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { MapsAPILoader } from '@agm/core';
import { FormsService } from "./../../services/form-service";
import { log } from 'util';
import { Router } from "@angular/router";

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.css']
})
export class filterFormComponent implements OnInit {
  public JobFilterForm: FormGroup;
  public minStartDate = new Date()
  public minEndDate = new Date()
  public maxDeadLineDate = new Date()
  user_id;
  UserID:any;
  display2='none';  
  message:any;

  public submitted = false;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  dropdownHobby = {};
  dropdownLang = {};
  dropdownEdu = {};
  listdata = [];
  hobbydata = [];
  langData = [];
  languages = [];
  interest =[];
  education_level =[];
  educData:any;
  hobby =[];
  item1;
  itemHobby;
  itemLang;
  itemEdu1;

address:any;
city:any;
state:any;
country:any;
places:any; 
public locations: Array<any>
public latitude: number;  
public longitude: number;                                                                                                                   
public zoom: number;  
@ViewChild('search',{static:true})
public searchElementRef: ElementRef;

autoCompleteCallback(selectedData: any) {

}


  constructor(private router: Router, private cookieService:CookieService,public  formService:FormsService, private apiService: ApiService,private formBuilder: FormBuilder,private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit() {

    this.UserID = JSON.parse(this.cookieService.get('loginData')).user_id;
    console.log(this.UserID);
    
    this.Interest();
    this.Hobby();
    this.Language();
    this.educationListData();
    this.selectedItems = [
     
      
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'interest_id',
      textField: 'interest_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      enableCheckAll:false,
      allowSearchFilter: true
    };

    this.dropdownHobby = {
      singleSelection: false,
      idField: 'hobbie_id',
      textField: 'hobbie_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      enableCheckAll:false,
      allowSearchFilter: true
    };

    this.dropdownLang  = {
      singleSelection: false,
      idField: 'language_id',
      textField: 'language_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      enableCheckAll:false,
      allowSearchFilter: true
    };

    this.dropdownEdu  = {
      singleSelection: false,
      idField: 'education_level_id',
      textField: 'education_level',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      enableCheckAll:false,
      allowSearchFilter: true
    };
    
    this.JobFilterForm = this.formBuilder.group({
     
      title: ['', Validators.required],
      city: ['', Validators.required],
      languages: ['',[Validators.required]],
      hobbie: [''],
      blood_group: ['',[Validators.required]],
      interest:[''],
      education_level:[''],
      female:[false],
      male:[true],
      address: ['', Validators.required],
      lat: [25.75, [Validators.required]],
      lon: [75.25, [Validators.required]],
      state: ['MP'],
      country: ['India'], 
      job_start:[''],
      job_end:[''],
      job_apply_deadline:[''],
      desc:[''],
      interview_start_time:[''],
      interview_end_time:['']

    });

    this.JobFilterForm.get('job_start').valueChanges.subscribe((value)=>{
      this.minEndDate =value
    })
    this.JobFilterForm.get('job_end').valueChanges.subscribe((value)=>{
      this.maxDeadLineDate =value
    })

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
          this.JobFilterForm.patchValue({address:this.address,city:city,state:state,country:country,lat:latitude,lon:longitude})

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

  onItemSelect(item: any) {
   
    this.item1 = item.langauge_id
    this.languages.push(this.item1);
    
  }

  onItemSelectInterest(item: any) {
   
    this.item1 = item.interest_id
   console.log(this.item1);
   
    this.interest.push(this.item1);
  console.log(this.interest);
  
   
  }

  onItemSelectHobby(item: any) {
   
    this.itemHobby = item.hobbie_id
    this.hobby.push(this.itemHobby);
 
  }

  onItemSelectLang(item: any) {
   
    this.itemLang = item.language_id
    this.languages.push(this.itemLang);
 
  }

  onItemSelectEducations(item: any) {
   
    this.itemEdu1 = item.education_level_id
   console.log(this.itemEdu1);
   
    
    this.education_level.push(this.itemEdu1);
  console.log(this.education_level);
      
  }

  onSelectAll(items: any) {
    console.log(items);
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

   // ===================Hobby Api===========
   
   async Hobby(){
    
     try {
      
     let data = await this.apiService.get("admin/master/hobbie")
  
       this.hobbydata = data.response;
       
    } catch (error) {
     
    }
    
   }

     // ===================Language Api===========
   
     async Language(){
      try {
       
      let data = await this.apiService.get("admin/master/language")
    
   
        this.langData = data.response;
        
     
     } catch (error) {
      
     }
     
    }

      // ===================Language Api===========
   
      async educationListData(){
    
        try {
        let data = await this.apiService.get("admin/master/education-level")
      
          if (data.success == true) {
            this.educData = data.response
            console.log(this.educData)
          }
        } catch (error) {
          console.log(error.error);
        }
       
      }
    
      // ===================Search Api===========
   
      async onFilter() {
        this.submitted = true;
       
        let gender = 0
  if(this.JobFilterForm.value.male){
    gender=1;
  }
  if(this.JobFilterForm.value.female){
    gender=2;
  } 
  if(this.JobFilterForm.value.male && this.JobFilterForm.value.female){
    gender=3;
  }
        
        this.JobFilterForm.value.interest = this.interest
        this.JobFilterForm.value.education_level = this.education_level
    this.JobFilterForm.value.languages = this.languages
    this.JobFilterForm.value.hobbie = this.hobby
    this.JobFilterForm.value.organization_id = this.UserID 

    let req = this.JobFilterForm.value
    req.gender =gender
          try {
          
            let data =await this.apiService.post("organization/create-job-filter", req)
            if(data.success == true){
              this.display2='block'
              this.message = "Your Request Added Successfully"
              console.log(this.message);
     
            }
 
          } catch (error) {
    console.log(error);
    
          }
      
      }
    
   
    public handleAddressChange(places){
      console.log(places)
    }

    
hidePop()
{
  this.router.navigate(['pages/filter-list']);
 
}

}
