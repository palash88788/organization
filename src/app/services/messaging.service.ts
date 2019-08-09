import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class MessagingService {

  messaging;
  currentMessage = new BehaviorSubject(null)

  constructor( private cookieService: CookieService) { 
    try {
      this.messaging = firebase.messaging()

    } catch (error) {
      console.log(error)
    }
  }


  updateToken(token) {
    this.cookieService.set("token",token)
  }

  getPermission() {
    try {
      if(firebase.messaging.isSupported()){
        this.messaging.requestPermission()
        .then(() => {
          console.log('Notification permission granted.');
          return this.messaging.getToken()
        })
        .then(token => {
          console.log(token)
          this.updateToken(token)
        })
        .catch((err) => {
          console.log('Unable to get permission to notify.', err);
        });
       }else{
         if(!this.cookieService.check("isNotified")){
          alert("Push Notification is not supported")
          this.cookieService.set("isNotified","true")
         }
       }
         
    } catch (error) {
      console.log(error);
      
    }
  
    }

    receiveMessage() {
      try {
        this.messaging.onMessage((payload) => {
          console.log("Message received. ", payload);
          this.currentMessage.next(payload)
        });
      } catch (error) {
        console.log(error)
      }
 

    }
}