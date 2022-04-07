import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-header-section',
  templateUrl: './dashboard-header-section.component.html',
  styleUrls: ['./dashboard-header-section.component.scss']
})
export class DashboardHeaderSectionComponent implements OnInit {

  @Input() name: string;

  constructor() { }

  refreshQBODimensions(): void {
    // TODO
  }

  ngOnInit(): void {
  }

}
