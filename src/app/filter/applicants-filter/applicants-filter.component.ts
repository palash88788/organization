import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from "@angular/router";
import { pipe } from '../../pipes/general-pipe/filter.model'
import { log } from 'util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsService } from "./../../services/form-service";
@Component({
  selector: 'app-applicants-filter',
  templateUrl: './applicants-filter.component.html',
  styleUrls: ['./applicants-filter.component.css']
})
export class applicantsFilterComponent implements OnInit {


  public nameSearch: pipe;
  public filter_id: any;
  public applicantUserLists: any;
  public filterApplicationsDatas: any;
  public isAllSelect = false;
  application = [];
  public isAllRequestSend = true
  public newArray: Array<any> = [];
  public selectedApplicant: any;
  public isApplicantSelected = true
  invalid: boolean
  display2 = 'none';
  display4 = 'none';
  public filter_status = {
    smsChecked: false,
    emailChecked: false
  }
  constructor(private cookieService: CookieService, private apiService: ApiService, private route: ActivatedRoute, private formBuilder: FormBuilder, public formService: FormsService) {
    this.filter_id = this.route.snapshot.params['id'];


  }

  async ngOnInit() {




    this.nameSearch = new pipe();
    this.applicantUserLists = []
    this.filterApplicationsDatas = ['filter_applications : []']
    let userData = JSON.parse(this.cookieService.get("loginData"))

    try {

      let data = await this.apiService.get("organization/organization-filter/" + this.filter_id)
      this.filterApplicationsDatas = data.response.search_response
      const applications = data.response.search_response.filter_applications
      this.applicantUserLists = JSON.parse(data.response.search_response.users)
      for (let o = 0; o < this.applicantUserLists.length; o++) {
        this.applicantUserLists[o].status = 0
      }
      if (applications && applications.length > 0) {
        for (let l = 0; l < applications.length; l++) {
          let r = applications[l]
          let m = this.applicantUserLists.findIndex(v => v.user_id == r.user_id)
          if (m != -1) {
            this.applicantUserLists[m].status = r.status
            this.applicantUserLists[m].isChecked = true
          } else {
            console.log(m)
            this.isAllRequestSend = false
          }



        }
      }

      console.log(this.applicantUserLists);





    } catch (error) {
      console.log(error);

    }



  }
  applicantSelect(row, event) {
    if (event) {
      let i = this.applicantUserLists.findIndex(o => o.isSelected == false || o.isSelected == undefined)
      this.isAllSelect = (i == -1)
      this.isApplicantSelected = true


    } else {
      this.isAllSelect = false
      let p = this.applicantUserLists.findIndex(o => o.isSelected == true || o.isSelected == undefined)
      if (p != -1) {
        this.isApplicantSelected = true
      } else {
        this.isApplicantSelected = false

      }
    }
  }

  allApplicantSelect(event) {
    this.applicantUserLists.map((item) => {
      if (!item.isChecked)
        item.isSelected = event
    })
    this.isApplicantSelected = event

  }

  async  onView(filter) {
    this.selectedApplicant = filter
    console.log(filter)
    this.display4 = "block";

  }

  async  onSelect() {

    this.display2 = "block";

  }
  async  onSubmit() {
    let filter_status = 0
    if(!confirm("Are you sure you want to send request"))
    return
    if (this.filter_status.smsChecked) {
      filter_status = 1
    }
    if (this.filter_status.emailChecked) {
      filter_status = 2
    }
    if (this.filter_status.emailChecked && this.filter_status.smsChecked) {
      filter_status = 3
    }

    var application = [];
    for (let p = 0; p < this.applicantUserLists.length; p++) {


      if (this.applicantUserLists[p].isSelected) {
        application.push({
          filter_id: this.filter_id,
          user_id: this.applicantUserLists[p].user_id,
          status: 1,
          email_id: this.applicantUserLists[p].email_id,

        })
        console.log(application);
      }
    }

    try {
      let data = await this.apiService.post("organization/filter-application ", { application, filter_status })
      location.reload();
      this.display2 = "none";
    } catch (error) {
    }
  }
onCancel(){
  this.display2 = "none";
}
  onHide() {
    this.display4 = "none";
  }
  hidePop() {

  }

}