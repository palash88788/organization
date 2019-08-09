import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../../services/api';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  public emailID: any;
  public userID: any;
  subscriptionData: any;
  public subscription: any
  durationArray: any;
  loginData: any
  subscriptionUpdateData: any

  constructor(private cookieService: CookieService, private apiService: ApiService, private router: Router) {
    this.subscription = {
      master_subscription_id: "",
      subscription_duration_id: "",
      amount: 0,
      trxref: "" + new Date().getTime(),
      plan: ""
    }
  }

  ngOnInit() {
    this.loginData = JSON.parse(this.cookieService.get('loginData'));
    this.emailID = this.loginData.email_id
    this.userID = this.loginData.user_id

    this.getSubscription()
  }

  async getSubscription() {
    try {
      let data = await this.apiService.get("admin/master-subscription")
      this.subscriptionData = data.response
      for (let l = 0; l < this.subscriptionData.length; l++) {

        this.subscriptionData[l].duration = this.subscriptionData[l].durations[0]
        this.onDurationChange(this.subscriptionData[l].durations[0].subscription_duration_id, l)


      }

      //  this.router.navigateByUrl("pages/home")
    } catch (error) {
      console.log(error)
    }
  }

  public onDurationChange(event, index) {

    let duration = this.subscriptionData[index].durations.find(u => u.subscription_duration_id == event)
    this.subscriptionData[index].duration = duration

    this.subscription.amount = duration.total_price * 100
    this.subscription.subscription_duration_id = duration.subscription_duration_id
    this.subscription.master_subscription_id = this.subscriptionData[index].master_subscription_id
    this.subscription.plan = this.subscriptionData[index].pay_stack_plan_id
    console.log(this.subscriptionData,this.subscription);
    this.subscription.trxref = new Date().getTime() + index 
    this.subscriptionData[index] = Object.assign(this.subscriptionData[index], this.subscription)

  }

  public paymentCancel() {
    console.log()

    location.reload()
  }

  async paymentDone(event) {

    this.subscriptionUpdateData = event
    this.subscriptionUpdateData.user_id = this.userID
    this.subscriptionUpdateData = Object.assign(this.subscriptionUpdateData, this.subscription)
    this.subscriptionUpdateData.trxref =this.subscriptionUpdateData.trxref +""
    console.log(this.subscriptionUpdateData,this.subscription);
    
    try {
      let updateSubs = await this.apiService.post("organization/buy-subscription/", this.subscriptionUpdateData)
      let subscriptionDatas = updateSubs.response
      console.log(subscriptionDatas);
      // this.router.navigateByUrl('/pages/subscription-list');
       this.router.navigateByUrl("/pages/subsription-list")
    } catch (error) {
      console.log(error)
    }
  }

  selectValue(sub) {
    console.log(sub);

    this.subscription.master_subscription_id = sub.master_subscription_id
   
      this.subscription.subscription_duration_id = sub.duration.subscription_duration_id
      this.subscription.amount = sub.duration.total_price * 100
      this.subscription.plan = sub.pay_stack_plan_id

    

  }

  // async subscriptionUpdate(){
  //   this.subscriptionData = this.subscription
  //   try {
  //     let updateSubs = await this.apiService.post("organization/buy-subscription/", this.subscriptionData.value)
  //     let subscriptionDatas = updateSubs.response
  //     console.log(subscriptionDatas);

  //      //  this.router.navigateByUrl("pages/home")
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

}
// "user_id":1,
// "master_subscription_id":1,
// "plan":"6 month",
// "amount":10,
// "trxref":"1562139454406",
// "transaction":"208227860"
