import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
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
import { SimpleSearchSelectComponent } from './components/simple-search-select/simple-search-select.component';
import { QboConnectorComponent } from './components/qbo-connector/qbo-connector.component';
import { ExpenseFieldCreationDialogComponent } from './components/import-settings/expense-field-creation-dialog/expense-field-creation-dialog.component';

// Pipes
import { TrimCharacterPipe } from './pipes/trim-character.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { SnakeCaseToSpaceCase } from './pipes/snake-case-to-space-case.pipe';

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
    ExpenseFormPreviewDialogComponent,
    SimpleSearchSelectComponent,
    QboConnectorComponent,
    TrimCharacterPipe,
    SearchPipe,
    SnakeCaseToSpaceCase,
    ExpenseFieldCreationDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DragDropModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule
  ],
  exports: [
    LoaderComponent,
    OnboardingStepperComponent,
    QboConnectorComponent,
    EmployeeSettingsComponent,
    ImportSettingsComponent,
    ExportSettingsComponent,
    AdvancedSettingsComponent,
    ConfigurationStepHeaderSectionComponent,
    SimpleSearchSelectComponent,
    MandatoryFieldComponent,
    OnboardingFooterComponent,
    TrimCharacterPipe,
    SearchPipe,
    SnakeCaseToSpaceCase
  ],
  entryComponents: [
    ExpenseFormPreviewDialogComponent,
    ExpenseFieldCreationDialogComponent
  ],
  providers: []
})
export class SharedModule { }
