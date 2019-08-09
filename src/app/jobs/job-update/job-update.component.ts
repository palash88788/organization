import { ElementRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormsService } from "./../../services/form-service";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from '../../services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MapsAPILoader } from '@agm/core';
import { Subject } from 'rxjs/internal/Subject';
// import { loadavg } from 'os';
// import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-job-update',
  templateUrl: './job-update.component.html',
  styleUrls: ['./job-update.component.css']
})
export class JobUpdateComponent implements OnInit {
  message: any;
  display2 = 'none';
  public EndTimeInterview: any
  public startTimeInterview: any
  public jobs: any = {};
  public job_id: any;
  public submitted = false;
  public minStartDate = new Date()
  public minEndDate = new Date()
  public maxDeadLineDate = new Date()
  dropdownSettingsInterest = {};
  item1;
  user: any;
  public serverInterests: Array<any>
  public deleteInterests: Array<any>
  public deleteInterestID: Array<any>
  listdata = [];
  updateJob;
  public interests: Array<any>
  public parentDocSubject = new Subject()
  docs=[]
  deleteDocs: any;
 
  address: any;
 
  public locations: Array<any>
 
  public zoom: number;
  @ViewChild('search', { static: true })
  public searchElementRef: ElementRef;

  autoCompleteCallback(selectedData: any) {
    
  }

  constructor(private formBuilder: FormBuilder, private cookieService: CookieService, private route: ActivatedRoute, private router: Router, private apiService: ApiService, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    this.job_id = this.route.snapshot.params['id'];
  }
  public selectedMoment = new Date();
  ngOnInit() {



    this.getJobDetail();
    this.Interest();
    this.user = JSON.parse(this.cookieService.get("loginData"))
    this.interests = []
    this.deleteInterests = []

    // this.jobs.get('job_start_date').valueChanges.subscribe((value)=>{
    //   this.minEndDate =value
    // })
    // this.jobs.get('job_end_date').valueChanges.subscribe((value)=>{
    //   this.maxDeadLineDate =value
    // })


    this.dropdownSettingsInterest = {
      singleSelection: false,
      idField: 'interest_id',
      textField: 'interest_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
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

          this.jobs.city =this.findResult(place.address_components,"administrative_area_level_2")
          this.jobs.state =this.findResult(place.address_components,"administrative_area_level_1")
          this.jobs.country = this.findResult(place.address_components,"country")
          this.address = place.formatted_address
          this.jobs.address =this.address
          //set latitude, longitude and zoom
          this.jobs.lat = place.geometry.location.lat();
          this.jobs.lon = place.geometry.location.lng();
          this.zoom = 12;
        
          console.log(this.jobs)                                                              


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


  onInterestItemSelect(item: any) {
    console.log(item);
    let i = this.deleteInterests.findIndex(y => y.interest_id == item.interest_id)
    console.log(i)
    if (i != -1) {
      this.deleteInterests.splice(i, 1)
      console.log(this.deleteInterests.splice(i, 1))
    }
    item.user_id = this.user
    this.interests.push(item)
  }
  onInterestDeSelect(item: any) {
    this.interests.splice(this.interests.findIndex(y => y.interest_id == item.interest_id), 1);
    let i = this.serverInterests.find(y => y.interest_id == item.interest_id)
    console.log(i)
    if (i) {
      this.deleteInterests.push(i)
      console.log(this.deleteInterests);
    }
  }

  async getJobDetail() {
    try {
      this.deleteDocs = []
      let data = await this.apiService.get("organization/job/" + this.job_id)
      this.jobs = data.response
      this.parentDocSubject.next(this.jobs.docs)
      //  console.log( .jobs.docs);


      //  this.router.navigateByUrl("pages/home")
      this.jobs.interests = this.interests

      this.serverInterests = []
      if (this.jobs.Job_interest_detail) {
        for (let l = 0; l < this.jobs.Job_interest_detail.length; l++) {
          this.jobs.Job_interest_detail[l] = Object.assign(this.jobs.Job_interest_detail[l], this.jobs.Job_interest_detail[l].interest_Detail)

        }

        delete this.jobs.job_applications
        delete this.jobs.conversations
        this.serverInterests = this.jobs.Job_interest_detail
        console.log(this.serverInterests);
      }
      if (this.jobs.interview_end_time) {
        this.EndTimeInterview = new Date("01-01-2019 " + this.jobs.interview_end_time)
      }
      if (this.jobs.interview_start_time) {
        this.startTimeInterview = new Date("01-01-2019 " + this.jobs.interview_start_time)
      }
      if (this.jobs.docs && this.jobs.docs.length > 0) {
        console.log(this.jobs.docs)

        for (let v = 0; v < this.jobs.docs.length; v++) {
          const element = this.jobs.docs[v];
            const b = element.job_doc_url.split(".");
            if (b) {
              element.imageTag = b[b.length - 1]
            }
          
          this.jobs.docs[v] = element
        }

      }

      console.log(this.jobs.interview_end_time);


    } catch (error) {
      console.log(error)
    }
  }


  async onRegister() {

    console.log(this.jobs);
    this.deleteInterestID = []
    for (let b = 0; b < this.deleteInterests.length; b++) {
      this.deleteInterests[b].user_interest_id = this.deleteInterests[b].user_interest_id
      this.deleteInterestID.push(this.deleteInterests[b].user_interest_id)
      console.log(this.deleteInterests[b].user_interest_id)

    }
    this.jobs.deleteInterests = this.deleteInterests
    const interview_start_time = new Date(this.startTimeInterview)
    this.jobs.interview_start_time = interview_start_time.getHours() + ":" + interview_start_time.getMinutes() + ":" + interview_start_time.getSeconds()
    this.jobs.docs = this.docs
    const interview_end_time = new Date(this.EndTimeInterview)
    this.jobs.interview_end_time = interview_end_time.getHours() + ":" + interview_end_time.getMinutes() + ":" + interview_end_time.getSeconds()


    this.jobs.deleteDocs = this.deleteDocs
    console.log(this.jobs);

    try {

      let data = await this.apiService.post("organization/update-job", this.jobs)
      console.log(data)
      if (data.success == true) {
        this.message = data.response
        this.display2 = 'block'

        console.log(this.message);

      }

    } catch (error) {
      console.log(error.error);
    }

  }


  public handleAddressChange(place) {
    console.log(place)
    this.jobs.city =this.findResult(place.address_components,"administrative_area_level_2")
    this.jobs.state =this.findResult(place.address_components,"administrative_area_level_1")
    this.jobs.country = this.findResult(place.address_components,"country")
    this.address = place.formatted_address
    this.jobs.address =this.address
    //set latitude, longitude and zoom
    this.jobs.lat = place.geometry.location.lat();
    this.jobs.lon = place.geometry.location.lng();
  }


  // ===================Interest Api===========

  async Interest() {

    this.submitted = true;

    try {

      let data = await this.apiService.get("admin/master/interest")

      this.listdata = data.response;

    } catch (error) {

    }

  }


  public changeAttachment(event) {
    this.docs = []
    for (let l = 0; l < event.thumbnail.length; l++) {
      const element = event.thumbnail[l];
      if (element.data)
        this.docs.push({
          job_id: this.job_id,
          doc_url: element.data.secure_url
        })

    }
  }



  hidePop() {
    this.router.navigate(['pages/jobs']);
  }
  remove(index) {
    this.deleteDocs.push({
      job_id: this.job_id,
      job_docs_id: this.jobs.docs[index].job_docs_id
    })
    this.jobs.docs.splice(index, 1)
  }
}
