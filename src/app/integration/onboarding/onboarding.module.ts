import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from 'src/app/shared/shared.module';

// Components
import { OnboardingExportSettingsComponent } from './onboarding-export-settings/onboarding-export-settings.component';
import { OnboardingImportSettingsComponent } from './onboarding-import-settings/onboarding-import-settings.component';
import { OnboardingAdvancedSettingsComponent } from './onboarding-advanced-settings/onboarding-advanced-settings.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingLandingComponent } from './onboarding-landing/onboarding-landing.component';
import { OnboardingQboConnectorComponent } from './onboarding-qbo-connector/onboarding-qbo-connector.component';
import { OnboardingEmployeeSettingsComponent } from './onboarding-employee-settings/onboarding-employee-settings.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';

@NgModule({
  declarations: [
    OnboardingExportSettingsComponent,
    OnboardingImportSettingsComponent,
    OnboardingAdvancedSettingsComponent,
    OnboardingDoneComponent,
    OnboardingComponent,
    OnboardingLandingComponent,
    OnboardingQboConnectorComponent,
    OnboardingEmployeeSettingsComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    SharedModule
  ]
})
export class OnboardingModule { }
