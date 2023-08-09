import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Angular Material
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyChipsModule as MatChipsModule, MAT_LEGACY_CHIPS_DEFAULT_OPTIONS as MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/legacy-chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatDatepickerModule } from '@angular/material/datepicker';


// Pipes
import { TrimCharacterPipe } from './pipes/trim-character.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { SnakeCaseToSpaceCase } from './pipes/snake-case-to-space-case.pipe';
import { ConfigurationSelectFieldComponent } from './components/configuration/configuration-select-field/configuration-select-field.component';
import { ConfigurationToggleFieldComponent } from './components/configuration/configuration-toggle-field/configuration-toggle-field.component';

// Components
import { EmployeeSettingsComponent } from './components/configuration/employee-settings/employee-settings.component';
import { LoaderComponent } from './components/core/loader/loader.component';
import { OnboardingStepperComponent } from './components/helpers/onboarding-stepper/onboarding-stepper.component';
import { ImportSettingsComponent } from './components/configuration/import-settings/import-settings.component';
import { ExportSettingsComponent } from './components/configuration/export-settings/export-settings.component';
import { AdvancedSettingsComponent } from './components/configuration/advanced-settings/advanced-settings.component';
import { OnboardingFooterComponent } from './components/core/onboarding-footer/onboarding-footer.component';
import { ConfigurationStepHeaderSectionComponent } from './components/configuration/configuration-step-header-section/configuration-step-header-section.component';
import { MandatoryFieldComponent } from './components/helpers/mandatory-field/mandatory-field.component';
import { SimpleTextSearchComponent } from './components/helpers/simple-text-search/simple-text-search.component';
import { QboConnectorComponent } from './components/configuration/qbo-connector/qbo-connector.component';
import { ExpenseFieldCreationDialogComponent } from './components/configuration/import-settings/expense-field-creation-dialog/expense-field-creation-dialog.component';
import { ConfigurationStepFooterSectionComponent } from './components/configuration/configuration-step-footer-section/configuration-step-footer-section.component';
import { HeaderComponent } from './components/core/header/header.component';
import { ZeroStateWithIllustrationComponent } from './components/core/zero-state-with-illustration/zero-state-with-illustration.component';
import { PaginatorComponent } from './components/helpers/paginator/paginator.component';
import { MappingHeaderSectionComponent } from './components/mapping/mapping-header-section/mapping-header-section.component';
import { MappingFilterComponent } from './components/mapping/mapping-filter/mapping-filter.component';
import { MappingTableComponent } from './components/mapping/mapping-table/mapping-table.component';
import { GenericMappingComponent } from './components/mapping/generic-mapping/generic-mapping.component';
import { ExportLogTableComponent } from './components/export-log/export-log-table/export-log-table.component';
import { DashboardHeaderSectionComponent } from './components/dashboard/dashboard-header-section/dashboard-header-section.component';
import { DashboardResolveMappingErrorDialogComponent } from './components/dashboard/dashboard-resolve-mapping-error-dialog/dashboard-resolve-mapping-error-dialog.component';
import { DashboardExportLogDialogComponent } from './components/dashboard/dashboard-export-log-dialog/dashboard-export-log-dialog.component';
import { DashboardQboErrorDialogComponent } from './components/dashboard/dashboard-qbo-error-dialog/dashboard-qbo-error-dialog.component';
import { ExportLogChildTableComponent } from './components/export-log/export-log-child-table/export-log-child-table.component';
import { PreviewDialogComponent } from './components/configuration/preview-dialog/preview-dialog.component';
import { ConfirmationDialogComponent } from './components/core/confirmation-dialog/confirmation-dialog.component';
import { MandatoryErrorMessageComponent } from './components/helpers/mandatory-error-message/mandatory-error-message.component';
import { AddEmailDialogComponent } from './components/configuration/advanced-settings/add-email-dialog/add-email-dialog.component';
import { EmailMultiSelectFieldComponent } from './components/configuration/email-multi-select-field/email-multi-select-field.component';
import { SkipExportLogTableComponent } from './components/export-log/skip-export-log-table/skip-export-log-table.component';
import { ToggleComponent } from './components/core/toggle/toggle.component';
import { SelectComponent } from './components/core/select/select.component';
import { EmailMultiSelectComponent } from '../core/email-multi-select/email-multi-select.component';

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
    SimpleTextSearchComponent,
    QboConnectorComponent,
    TrimCharacterPipe,
    SearchPipe,
    SnakeCaseToSpaceCase,
    ExpenseFieldCreationDialogComponent,
    ConfigurationStepFooterSectionComponent,
    ConfigurationSelectFieldComponent,
    ConfigurationToggleFieldComponent,
    HeaderComponent,
    ZeroStateWithIllustrationComponent,
    PaginatorComponent,
    MappingHeaderSectionComponent,
    MappingFilterComponent,
    MappingTableComponent,
    GenericMappingComponent,
    ExportLogTableComponent,
    DashboardHeaderSectionComponent,
    DashboardResolveMappingErrorDialogComponent,
    DashboardExportLogDialogComponent,
    DashboardQboErrorDialogComponent,
    ExportLogChildTableComponent,
    PreviewDialogComponent,
    ConfirmationDialogComponent,
    ConfirmationDialogComponent,
    MandatoryErrorMessageComponent,
    AddEmailDialogComponent,
    EmailMultiSelectFieldComponent,
    SkipExportLogTableComponent,
    ToggleComponent,
    SelectComponent,
    EmailMultiSelectComponent
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
    MatTooltipModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
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
    SimpleTextSearchComponent,
    MandatoryFieldComponent,
    OnboardingFooterComponent,
    TrimCharacterPipe,
    SearchPipe,
    SnakeCaseToSpaceCase,
    ConfigurationStepFooterSectionComponent,
    ConfigurationSelectFieldComponent,
    ConfigurationToggleFieldComponent,
    HeaderComponent,
    ZeroStateWithIllustrationComponent,
    PaginatorComponent,
    MappingHeaderSectionComponent,
    MappingFilterComponent,
    MappingTableComponent,
    GenericMappingComponent,
    ExportLogTableComponent,
    SkipExportLogTableComponent,
    DashboardHeaderSectionComponent,
    DashboardResolveMappingErrorDialogComponent,
    ExportLogChildTableComponent,
    MandatoryErrorMessageComponent,
    MatChipsModule,
    ToggleComponent,
    SelectComponent,
    EmailMultiSelectComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class SharedModule { }
