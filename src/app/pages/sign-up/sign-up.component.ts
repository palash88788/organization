import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { FormsService } from "./../../services/form-service";
import { ApiService } from '../../services/api';
import { Md5 } from 'ts-md5/dist/md5';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public registerForm: FormGroup;
  public submitted = false;
  display2 ="none";
  message;
  signStatus:any;
  constructor(private formBuilder: FormBuilder, private router: Router,public  formService:FormsService,private apiService: ApiService, private cookieService:CookieService,) { }

  ngOnInit() {
   
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      registration_id: ['', Validators.required],
      address: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,4}')]],
      password: ['', [Validators.required]],
      contact_no:['', [Validators.required]],
      organization_type: [''],
      facebook: [''],
      website: [''],
      other: [''],
      twitter: [''],
      user_type: [2],
      url:[''],
      avatar_image:['']
    })
  }

 async onRegister() {
    this.submitted = true;
    const email = (<HTMLInputElement>document.getElementById('txtEmail'));
    const filter = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if(!filter.test(email.value))
     {
           
     }
      try {
        this.registerForm.value.password = Md5.hashStr(this.registerForm.value.password);
        let req= {
          token_uuid :this.cookieService.get("token")
        }
        req =Object.assign(req,this.registerForm.value)
        let data = await this.apiService.post("register",req)
        this.signStatus = data.success;
       

        console.log(this.signStatus);
      
        if(this.signStatus == true){

          this.message=data.response.message
          window.alert(this.message)
          this.router.navigate(['/']);
        }
     
        
 
      } catch (error) {
        this.message=error.error
        this.display2="block"
        
   
      }
    }

    hidePop()
    {
      this.display2="none"
    }

    // File Upload Function   
    async changeAvatarListener($event) {
      console.log($event);
      for (let l = 0; l < $event.thumbnail.length; l++) {
        const element = $event.thumbnail[l];
        console.log(element);
        
        // this.registerForm.value.avatar_image = element.data.secure_url
        this.registerForm.patchValue({avatar_image:element.data.secure_url})
        console.log(this.registerForm.value.avatar_image)
      }
      console.log(this.registerForm.value.avatar_image)
      
    
    }
  
}
