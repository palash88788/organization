import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.css']
})
export class FullLayoutComponent implements OnInit {
  user_id
  constructor(private cookieService: CookieService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user_id = JSON.parse(this.cookieService.get("loginData")).user_id;
    console.log(this.user_id)
  }

}
