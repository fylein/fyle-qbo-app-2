import { Component, OnInit, Input } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/onboarding-stepper.model';

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
      icon: 'qbo-connector'
    },
    {
      active: false,
      completed: false,
      step: 'Map Employees',
      icon: 'employee-setting'
    },
    {
      active: false,
      completed: false,
      step: 'Export Settings',
      icon: 'export-setting'
    },
    {
      active: false,
      completed: false,
      step: 'Import Settings',
      icon: 'import-setting'
    },
    {
      active: false,
      completed: false,
      step: 'Advanced Settings',
      icon: 'advanced-setting'
    }
  ];

  constructor() { }

  updateActiveStepper(): void {
    for (let index = 0; index < this.onboardingSteps.length; index++) {
      if (this.onboardingSteps[index].step === this.currentStep) {
        this.onboardingSteps[index].active = true;
        break;
      } else {
        this.onboardingSteps[index].completed = true;
      }
    }
  }

  ngOnInit(): void {
    this.updateActiveStepper();
  }

}
