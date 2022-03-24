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
      step: 'Connect to QBO',
      icon: 'qbo-connector',
      route: 'qbo_connector'
    },
    {
      active: false,
      completed: false,
      step: 'Map Employees',
      icon: 'employee-setting',
      route: 'employee_settings'
    },
    {
      active: false,
      completed: false,
      step: 'Export Settings',
      icon: 'export-setting',
      route: 'export_settings'
    },
    {
      active: false,
      completed: false,
      step: 'Import Settings',
      icon: 'import-setting',
      route: 'import_settings'
    },
    {
      active: false,
      completed: false,
      step: 'Advanced Settings',
      icon: 'advanced-setting',
      route: 'advanced_settings'
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
