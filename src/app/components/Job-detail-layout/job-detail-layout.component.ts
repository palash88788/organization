import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-job-detail-layout',
  templateUrl: './job-detail-layout.component.html',
  styleUrls: ['./job-detail-layout.component.css']
})
export class jobDetailLayoutComponent implements OnInit {
public job_id;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.job_id = this.route.children[0].snapshot.params["id"]
    console.log(this.job_id)
  }

}
