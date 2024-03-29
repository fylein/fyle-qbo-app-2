import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Angular Material
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
import { CloneSettingsComponent } from './clone-settings/clone-settings.component';

@NgModule({
  declarations: [
    OnboardingExportSettingsComponent,
    OnboardingImportSettingsComponent,
    OnboardingAdvancedSettingsComponent,
    OnboardingDoneComponent,
    OnboardingComponent,
    OnboardingLandingComponent,
    OnboardingQboConnectorComponent,
    OnboardingEmployeeSettingsComponent,
    CloneSettingsComponent
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
    SharedModule,
    MatMenuModule,
    MatTooltipModule,
    SharedModule,
    MatProgressSpinnerModule,
    DragDropModule
  ]
})
export class OnboardingModule { }
