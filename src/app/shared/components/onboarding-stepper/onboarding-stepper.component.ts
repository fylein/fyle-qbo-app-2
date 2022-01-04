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
      completed: false,
      step: 'Connect to QBO',
    },
    {
      completed: false,
      step: 'Map Employees',
    },
    {
      completed: false,
      step: 'Export Settings',
    },
    {
      completed: false,
      step: 'Import Settings'
    }
  ];

  constructor() { }

  updateActiveStepper(): void {
    for (let index = 0; index < this.onboardingSteps.length; index++) {
      if (this.onboardingSteps[index].step !== this.currentStep) {
        this.onboardingSteps[index].completed = true;
      } else {
        this.onboardingSteps[index].completed = true;
        break;
      }
    }
  }

  ngOnInit(): void {
    this.updateActiveStepper();
  }

}
