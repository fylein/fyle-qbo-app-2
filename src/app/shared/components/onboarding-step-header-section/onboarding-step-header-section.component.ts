import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-step-header-section',
  templateUrl: './onboarding-step-header-section.component.html',
  styleUrls: ['./onboarding-step-header-section.component.scss']
})
export class OnboardingStepHeaderSectionComponent implements OnInit {

  headerText: string;
  contentText: string;

  constructor(
    private router: Router
  ) { }

  private setupContent(): void {
    const activePage = this.router.url.split('/').pop();

    switch (activePage) {
      case 'qbo_connector':
        this.headerText = 'Connect to Quickbooks Online';
        this.contentText = 'Connect to the Quickbooks Online Company from which you would like to import and export data. The Fyle org and Quickbooks Online company cannot be changed once the configuration steps are complete.';
        break;
      case 'employee_settings':
        this.headerText = 'Map Employees';
        this.contentText = 'Choose appropriate representation of your Employees in Quickbooks Online. ';
        break;
    }
  }

  ngOnInit(): void {
    this.setupContent();
  }

}
