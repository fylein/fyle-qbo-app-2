import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuration-employee-settings',
  templateUrl: './configuration-employee-settings.component.html',
  styleUrls: ['./configuration-employee-settings.component.scss']
})
export class ConfigurationEmployeeSettingsComponent implements OnInit {

  isLoading: boolean = true;

  constructor() { }

  isLoaded(isLoaded: boolean): void {
    this.isLoading = !isLoaded;
  }

  ngOnInit(): void {
  }

}
