import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspacesGuard } from 'src/app/core/guard/workspaces.guard';
import { OnboardingAdvancedSettingsComponent } from './onboarding-advanced-settings/onboarding-advanced-settings.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingEmployeeSettingsComponent } from './onboarding-employee-settings/onboarding-employee-settings.component';
import { OnboardingExportSettingsComponent } from './onboarding-export-settings/onboarding-export-settings.component';
import { OnboardingImportSettingsComponent } from './onboarding-import-settings/onboarding-import-settings.component';
import { OnboardingLandingComponent } from './onboarding-landing/onboarding-landing.component';
import { OnboardingQboConnectorComponent } from './onboarding-qbo-connector/onboarding-qbo-connector.component';
import { OnboardingComponent } from './onboarding.component';
import { CloneSettingsComponent } from './clone-settings/clone-settings.component';


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
        path: 'clone_settings',
        component: CloneSettingsComponent,
        canActivate: [WorkspacesGuard]
      },
      {
        path: 'export_settings',
        component: OnboardingExportSettingsComponent,
        canActivate: [WorkspacesGuard]
      },
      {
        path: 'qbo_connector',
        component: OnboardingQboConnectorComponent
      },
      {
        path: 'employee_settings',
        component: OnboardingEmployeeSettingsComponent,
        canActivate: [WorkspacesGuard]
      },
      {
        path: 'import_settings',
        component: OnboardingImportSettingsComponent,
        canActivate: [WorkspacesGuard]
      },
      {
        path: 'advanced_settings',
        component: OnboardingAdvancedSettingsComponent,
        canActivate: [WorkspacesGuard]
      },
      {
        path: 'done',
        component: OnboardingDoneComponent,
        canActivate: [WorkspacesGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
