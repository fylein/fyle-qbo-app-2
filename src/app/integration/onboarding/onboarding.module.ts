import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { OnboardingExportSettingsComponent } from './onboarding-export-settings/onboarding-export-settings.component';
import { OnboardingImportSettingsComponent } from './onboarding-import-settings/onboarding-import-settings.component';
import { OnboardingAdvancedSettingsComponent } from './onboarding-advanced-settings/onboarding-advanced-settings.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingLandingComponent } from './onboarding-landing/onboarding-landing.component';
import { OnboardingQboConnectorComponent } from './onboarding-qbo-connector/onboarding-qbo-connector.component';
import { OnboardingEmployeeSettingsComponent } from './onboarding-employee-settings/onboarding-employee-settings.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { OnboardingHeaderComponent } from 'src/app/shared/components/onboarding-header/onboarding-header.component';
import { QboConnectorComponent } from 'src/app/shared/components/qbo-connector/qbo-connector.component';
import { OnboardingStepperComponent } from 'src/app/shared/components/onboarding-stepper/onboarding-stepper.component';


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
    LoaderComponent,
    OnboardingHeaderComponent,
    QboConnectorComponent,
    OnboardingStepperComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatStepperModule
  ]
})
export class OnboardingModule { }
