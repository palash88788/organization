import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from "@angular/router";
import { ApiService } from '../../services/api';
import { FormsService } from "./../../services/form-service";
import { CookieService } from 'ngx-cookie-service';
import { Md5 } from 'ts-md5/dist/md5';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  confirmForm: FormGroup;
  submitted = false;
  imageLoader = false;
  @Input() token_id = "12345"
  UserID:any;
  message:any;
  display2='none';
  CPassDatas:any;
  condition:string
  
  constructor(private formBuilder: FormBuilder,private MD5: Md5,private route: ActivatedRoute, private router: Router, private apiService: ApiService,public formService:FormsService,private cookieService:CookieService) { 
    this.message = this.route.snapshot.params['message'];
    console.log(this.message);
    
  }

  ngOnInit() {
    this.confirmForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      Cpassword: ['', [Validators.required, Validators.minLength(6)]],
      
    })
  }

  async onSubmit() {
    console.log(this.confirmForm)
    this.confirmForm.value.verification_code =  this.message  
    console.log(this.confirmForm.value.password == this.confirmForm.value.Cpassword);
    
    if(this.confirmForm.value.password == this.confirmForm.value.Cpassword){
      this.confirmForm.value.verification_code =  this.message
      this.confirmForm.value.password = Md5.hashStr(this.confirmForm.value.password);
      this.confirmForm.value.Cpassword = Md5.hashStr(this.confirmForm.value.Cpassword);
      try {
      
        let data = await this.apiService.post("change-password", this.confirmForm.value)
        this.CPassDatas = data.response
        this.imageLoader = false;
        this.router.navigateByUrl('');
      } catch (error) {
        this.message = error.error
        this.imageLoader = false;
          this.display2="block";
      } 
    }else{
      this.display2="block";
    this.message = "Both Password Doesn't Match"
  }
   }

   hidePop(){
    this.display2="none";
  }
 
  

  }


