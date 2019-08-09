import { Component,OnInit } from '@angular/core';
import { MessagingService } from "./services/messaging.service";
import { BnNgIdleService } from 'bn-ng-idle';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";
import { CheckVersionService } from "./services/check-version";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent  implements OnInit {
 message;
  title = 'adhoc-ng';
  constructor(private msgService: MessagingService,private checkVersionService: CheckVersionService, private bnIdle: BnNgIdleService, private cookieService:CookieService, private router: Router) {
    this.bnIdle.startWatching(60*60*2).subscribe((res) => {
      if(res) {
        try {
          this.cookieService.delete('loginData',"/")
          this.router.navigateByUrl('');
          console.log(this.cookieService.get('loginData'))
        } catch (error) {
          console.log(error);
          
        }
      }
    })
    this.checkVersionService.ngOnInit();
  }

  ngOnInit() {
    this.msgService.getPermission()
    this.msgService.receiveMessage()
    this.message = this.msgService.currentMessage
  }
}