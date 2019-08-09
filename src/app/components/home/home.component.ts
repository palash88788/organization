import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { ChartsModule,Label } from 'ng2-charts';
import { Chart } from 'chart.js';
import { ApiService } from '../../services/api';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  revenueCanvas: any;
  revenueCtx: any;
  revenueChart:any
  temp_array:any;
  dashBoardData:any
  countData:any;

  userData: any;
  constructor(private apiService: ApiService, private cookieService:CookieService, ) { }

  ngOnInit() {

    this.countData = ['this.dashBoardData.jobCount : {}']
    this.userData = JSON.parse(this.cookieService.get("loginData"))

    this.revenueCanvas = document.getElementById('revenueChart');
    this.revenueCtx = this.revenueCanvas.getContext('2d');
    this.revenueChart = new Chart(this.revenueCtx, {
      type: 'bar',
      options: {
        responsive: false
      }
    });
    this.getDahboardList()
  }

  async getDahboardList(){
    let    datearray = []
      let  temp_array = []
    
      try {
   
        
        let data = await this.apiService.get("dashboard/organization/"+this.userData.user_id)
      this.dashBoardData = data.response
      console.log(  this.dashBoardData);
      
      this.countData = this.dashBoardData.jobCount[0]
      console.log(this.countData.count);
      this.dashBoardData.jobmonth.forEach(obj => {
             
          datearray.push(obj.month)
          temp_array.push(obj.count);
        
       })
       this.revenueChart.destroy();
           this.revenueChart = new Chart(this.revenueCtx, {
             type: 'bar',
             data: {
               labels: datearray,
               datasets: [{
                 label: "Job Analytics",
                 data: temp_array,
                 backgroundColor: [
                   'rgba(54, 162, 235, 0.1)'
                 ],
                 borderColor: ['#255e2b'],
                 borderWidth: 1
               }]
             },
             options: {
               responsive: true
             }
           });
           this.revenueChart.update();
       
     //  this.temp_array[14] = 21;
    
      } catch (error) {
        console.log(error);
        
      }
    }
  }
