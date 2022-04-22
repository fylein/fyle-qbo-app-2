import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';


@Component({
  selector: 'app-onboarding-stepper',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.scss']
})
export class OnboardingStepperComponent implements OnInit {

  @Input() currentStep: string;
  onboardingSteps: OnboardingStepper[] = [
    {
      active: false,
      completed: false,
      number: 1,
      step: 'Connect to QBO',
      icon: 'qbo-connector',
      route: 'qbo_connector',
      size: {
        height: '20px',
        width: '10px'
      }
    },
    {
      active: false,
      completed: false,
      number: 2,
      step: 'Map Employees',
      icon: 'employee-setting',
      route: 'employee_settings',
      size: {
        height: '19px',
        width: '20px'
      }
    },
    {
      active: false,
      completed: false,
      number: 3,
      step: 'Export Settings',
      icon: 'export-setting',
      route: 'export_settings',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 4,
      step: 'Import Settings',
      icon: 'import-setting',
      route: 'import_settings',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 5,
      step: 'Advanced Settings',
      icon: 'advanced-setting',
      route: 'advanced_settings',
      size: {
        height: '20px',
        width: '20px'
      }
    }
  ];

  constructor(
    private router: Router
  ) { }

  private updateActiveStepper(): void {
    for (let index = 0; index < this.onboardingSteps.length; index++) {
      if (this.onboardingSteps[index].step === this.currentStep) {
        this.onboardingSteps[index].active = true;
        break;
      } else {
        this.onboardingSteps[index].completed = true;
      }
    }
  }

  navigate(canNavigate: boolean, route: string): void {
    if (canNavigate) {
      this.router.navigate([`/workspaces/onboarding/${route}`]);
    }
  }

  ngOnInit(): void {
    this.updateActiveStepper();
  }

}
