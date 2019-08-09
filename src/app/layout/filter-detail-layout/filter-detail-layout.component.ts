import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-filter-detail-layout',
  templateUrl: './filter-detail-layout.component.html',
  styleUrls: ['./filter-detail-layout.component.css']
})
export class filterDetailLayoutComponent implements OnInit {
public filter_id;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.filter_id = this.route.children[0].snapshot.params["id"]
    console.log(this.filter_id)
  }

}
