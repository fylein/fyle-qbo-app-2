import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { EmployeeSettingsComponent } from './components/employee-settings/employee-settings.component';
import { LoaderComponent } from './components/loader/loader.component';
import { OnboardingStepperComponent } from './components/onboarding-stepper/onboarding-stepper.component';

@NgModule({
  declarations: [
    EmployeeSettingsComponent,
    LoaderComponent,
    OnboardingStepperComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    CdkStepperModule
  ],
  exports: [
    LoaderComponent,
    OnboardingStepperComponent
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: true }
    }
  ]
})
export class SharedModule { }
