import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ApiService } from '../../services/api';
import { from } from 'rxjs/internal/observable/from';
import { FormsService } from "./../../services/form-service";
import { CookieService } from 'ngx-cookie-service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public  form: FormGroup;
  public submitted = false;
 
  cookieValue: any;
  display2='none';
  public isTemplateSelected=false;
  public ArrayLogin: any;
  message:any;
  loginStatus:any;
  public imageLoader:boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router,public formService:FormsService,private apiService: ApiService, private cookieService:CookieService, ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email_id: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,4}')]],
      password: ['', [Validators.required]]
    })
  }

  async onSubmit() {
    this.form.value.password = Md5.hashStr(this.form.value.password);
   const email = (<HTMLInputElement>document.getElementById('txtEmail'));
   const filter = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    this.imageLoader = true;
    if(!filter.test(email.value))
    {
    }
    this.form.value.user_type = 2
      try {
        let req= {
          token_uuid :this.cookieService.get("token")
        }
        req =Object.assign(req,this.form.value)
        let data = await this.apiService.post("login",req)
        this.ArrayLogin = data.response;
        this.loginStatus = data.success;
        this.imageLoader = false;
        if(this.loginStatus == true)
        {
          this.cookieService.set('loginData',JSON.stringify(this.ArrayLogin.user));
          if(this.cookieService.get('loginData') != '' || this.cookieService.get('loginData') != undefined) {
            this.cookieValue = JSON.parse(this.cookieService.get('loginData'));
              this.router.navigateByUrl('pages/home');

          }
      }
      else if(this.loginStatus == false){
        this.display2="block";
        this.message = data.error
      }
    
      } catch (error) {
        this.imageLoader = false;
        this.display2="block";
        this.message = error.error
      }
    
    
   }

   hidePop()
   {
    this.display2="none";
   }
}





