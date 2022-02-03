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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { EmployeeSettingsComponent } from './components/employee-settings/employee-settings.component';
import { LoaderComponent } from './components/loader/loader.component';
import { OnboardingStepperComponent } from './components/onboarding-stepper/onboarding-stepper.component';
import { ImportSettingsComponent } from './components/import-settings/import-settings.component';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';
import { AdvancedSettingsComponent } from './components/advanced-settings/advanced-settings.component';
import { OnboardingFooterComponent } from './components/onboarding-footer/onboarding-footer.component';
import { OnboardingStepHeaderSectionComponent } from './components/onboarding-step-header-section/onboarding-step-header-section.component';

@NgModule({
  declarations: [
    EmployeeSettingsComponent,
    ImportSettingsComponent,
    ExportSettingsComponent,
    AdvancedSettingsComponent,
    LoaderComponent,
    OnboardingStepperComponent,
    OnboardingFooterComponent,
    OnboardingStepHeaderSectionComponent
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
    MatSlideToggleModule,
    MatCheckboxModule,
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
