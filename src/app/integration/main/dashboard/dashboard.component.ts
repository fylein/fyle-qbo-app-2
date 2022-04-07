import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  zeroState: boolean = false;
  exportExpenses: boolean = false;
  expensesCount: number = 20;
  failedExpensesCount: number = 8;
  exportInProgress: boolean = false;

  constructor() { }

  export(): void {
    // TODO
  }

  ngOnInit(): void {
  }

}
