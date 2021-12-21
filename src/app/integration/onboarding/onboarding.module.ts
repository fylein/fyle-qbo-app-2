import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingConnectQboComponent } from './onboarding-connect-qbo/onboarding-connect-qbo.component';
import { OnboardingMapEmployeesComponent } from './onboarding-map-employees/onboarding-map-employees.component';
import { OnboardingExportSettingsComponent } from './onboarding-export-settings/onboarding-export-settings.component';
import { OnboardingImportSettingsComponent } from './onboarding-import-settings/onboarding-import-settings.component';
import { OnboardingAdvancedSettingsComponent } from './onboarding-advanced-settings/onboarding-advanced-settings.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';



@NgModule({
  declarations: [
    OnboardingConnectQboComponent,
    OnboardingMapEmployeesComponent,
    OnboardingExportSettingsComponent,
    OnboardingImportSettingsComponent,
    OnboardingAdvancedSettingsComponent,
    OnboardingDoneComponent
  ],
  imports: [
    CommonModule
  ]
})
export class OnboardingModule { }
