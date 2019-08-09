import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute} from "@angular/router";
import { ApiService } from '../../services/api';
import { from } from 'rxjs/internal/observable/from';
import { error } from '@angular/compiler/src/util';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
 

  sendEmail: FormGroup;
  submitted = false;
  condition:string
  message:string
  status
  display2='none';
  imageLoader:boolean = false;
  user_type: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.sendEmail = this.formBuilder.group({
      // name: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,4}')]],
   
    })

 
  }

  async onSubmit() {
    const email = (<HTMLInputElement>document.getElementById('txtEmail'));
   const filter = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
   this.sendEmail.value.user_type = 2
    try {
  
      let data = await this.apiService.post("forget-password", this.sendEmail.value)
      console.log(data);
      this.status=data.success
      if(this.status==true){

        this.message=data.response
      }
      else{
        this.message=data.error
      }
  
      
      this.imageLoader = false;
    }
     catch (error) {
      console.log(error);
      
      this.message = error
      // this.message = error.error
      
      this.imageLoader = false;
        this.display2="block";
    }   
   
      }

     async reSendLink()
     {
     try {
      
      let data = await this.apiService.post("forget-password", this.sendEmail.value)
      this.imageLoader = false;
      this.router.navigateByUrl('/change-password');
    } catch (error) {
      this.message = error.error
      this.imageLoader = false;
        this.display2="block";
    }   
  }

      hidePop(){
        if(this.condition == "success"){
          this.router.navigate(['/sign-in'])
        }
        else if(this.condition == "failure"){
          this.router.navigate(['/forgot-password'])
        }
      }
     
  

  }



