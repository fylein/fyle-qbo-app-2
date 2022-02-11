import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EmployeeSettingsComponent } from './components/employee-settings/employee-settings.component';
import { LoaderComponent } from './components/loader/loader.component';
import { OnboardingStepperComponent } from './components/onboarding-stepper/onboarding-stepper.component';
import { ImportSettingsComponent } from './components/import-settings/import-settings.component';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';
import { AdvancedSettingsComponent } from './components/advanced-settings/advanced-settings.component';
import { OnboardingFooterComponent } from './components/onboarding-footer/onboarding-footer.component';
import { ConfigurationStepHeaderSectionComponent } from './components/configuration-step-header-section/configuration-step-header-section.component';
import { MandatoryFieldComponent } from './components/mandatory-field/mandatory-field.component';
import { ExpenseFormPreviewDialogComponent } from './components/expense-form-preview-dialog/expense-form-preview-dialog.component';

@NgModule({
  declarations: [
    EmployeeSettingsComponent,
    ImportSettingsComponent,
    ExportSettingsComponent,
    AdvancedSettingsComponent,
    LoaderComponent,
    OnboardingStepperComponent,
    OnboardingFooterComponent,
    ConfigurationStepHeaderSectionComponent,
    MandatoryFieldComponent,
    ExpenseFormPreviewDialogComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  exports: [
    LoaderComponent,
    OnboardingStepperComponent
  ],
  providers: []
})
export class SharedModule { }
