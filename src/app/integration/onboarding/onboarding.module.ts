import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
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
import { EmployeeSettingsComponent } from 'src/app/shared/components/employee-settings/employee-settings.component';
import { ImportSettingsComponent } from 'src/app/shared/components/import-settings/import-settings.component';
import { ExportSettingsComponent } from 'src/app/shared/components/export-settings/export-settings.component';
import { ExpenseFieldCreationDialogComponent } from 'src/app/shared/components/import-settings/expense-field-creation-dialog/expense-field-creation-dialog.component';
import { AdvancedSettingsComponent } from 'src/app/shared/components/advanced-settings/advanced-settings.component';
import { OnboardingFooterComponent } from 'src/app/shared/components/onboarding-footer/onboarding-footer.component';
import { ConfigurationStepHeaderSectionComponent } from 'src/app/shared/components/configuration-step-header-section/configuration-step-header-section.component';
import { MandatoryFieldComponent } from 'src/app/shared/components/mandatory-field/mandatory-field.component';
import { ExpenseFormPreviewDialogComponent } from 'src/app/shared/components/expense-form-preview-dialog/expense-form-preview-dialog.component';
import { SnakeCaseToSpaceCase } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';

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
    OnboardingFooterComponent,
    QboConnectorComponent,
    OnboardingStepperComponent,
    EmployeeSettingsComponent,
    ImportSettingsComponent,
    ExportSettingsComponent,
    ExpenseFieldCreationDialogComponent,
    AdvancedSettingsComponent,
    ConfigurationStepHeaderSectionComponent,
    MandatoryFieldComponent,
    ExpenseFormPreviewDialogComponent,
    SnakeCaseToSpaceCase,
    SearchPipe
  ],
  entryComponents: [
    ExpenseFieldCreationDialogComponent,
    ExpenseFormPreviewDialogComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DragDropModule
  ]
})
export class OnboardingModule { }
