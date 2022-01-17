import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnboardingAdvancedSettingsComponent } from './onboarding-advanced-settings/onboarding-advanced-settings.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingEmployeeSettingsComponent } from './onboarding-employee-settings/onboarding-employee-settings.component';
import { OnboardingExportSettingsComponent } from './onboarding-export-settings/onboarding-export-settings.component';
import { OnboardingImportSettingsComponent } from './onboarding-import-settings/onboarding-import-settings.component';
import { OnboardingLandingComponent } from './onboarding-landing/onboarding-landing.component';
import { OnboardingQboConnectorComponent } from './onboarding-qbo-connector/onboarding-qbo-connector.component';
import { OnboardingComponent } from './onboarding.component';


const routes: Routes = [
  {
    path: 'landing',
    component: OnboardingLandingComponent
  },
  {
    path: '',
    component: OnboardingComponent,
    children: [
      {
        path: 'export_settings',
        component: OnboardingExportSettingsComponent
      },
      {
        path: 'qbo_connector',
        component: OnboardingQboConnectorComponent
      },
      {
        path: 'employee_settings',
        component: OnboardingEmployeeSettingsComponent
      },
      {
        path: 'import_settings',
        component: OnboardingImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: OnboardingAdvancedSettingsComponent
      },
      {
        path: 'done',
        component: OnboardingDoneComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
