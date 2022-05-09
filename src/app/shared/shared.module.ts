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
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
import { SimpleSearchSelectComponent } from './components/helpers/simple-search-select/simple-search-select.component';
import { QboConnectorComponent } from './components/configuration/qbo-connector/qbo-connector.component';
import { ExpenseFieldCreationDialogComponent } from './components/configuration/import-settings/expense-field-creation-dialog/expense-field-creation-dialog.component';
import { ConfigurationStepFooterSectionComponent } from './components/configuration/configuration-step-footer-section/configuration-step-footer-section.component';
import { OnboardingHeaderComponent } from './components/core/onboarding-header/onboarding-header.component';
import { ZeroStateWithIllustrationComponent } from './components/core/zero-state-with-illustration/zero-state-with-illustration.component';
import { SimpleSearchTextComponent } from './components/helpers/simple-search-text/simple-search-text.component';
import { AdvancedSearchSelectComponent } from './components/helpers/advanced-search-select/advanced-search-select.component';
import { PaginatorComponent } from './components/helpers/paginator/paginator.component';
import { MappingHeaderSectionComponent } from './components/mapping/mapping-header-section/mapping-header-section.component';
import { MappingStatsComponent } from './components/mapping/mapping-stats/mapping-stats.component';
import { MappingFilterComponent } from './components/mapping/mapping-filter/mapping-filter.component';
import { MappingTableComponent } from './components/mapping/mapping-table/mapping-table.component';
import { MappingShimmersComponent } from './components/mapping/mapping-shimmers/mapping-shimmers.component';
import { GenericMappingComponent } from './components/mapping/generic-mapping/generic-mapping.component';
import { ExportLogHeaderSectionComponent } from './components/export-log/export-log-header-section/export-log-header-section.component';
import { ExportLogDateFilterComponent } from './components/export-log/export-log-date-filter/export-log-date-filter.component';
import { ExportLogTableComponent } from './components/export-log/export-log-table/export-log-table.component';
import { DashboardHeaderSectionComponent } from './components/dashboard/dashboard-header-section/dashboard-header-section.component';
import { DashboardExportComponent } from './components/dashboard/dashboard-export/dashboard-export.component';
import { DashboardExportStatsComponent } from './components/dashboard/dashboard-export-stats/dashboard-export-stats.component';
import { DashboardExportErrorsComponent } from './components/dashboard/dashboard-export-errors/dashboard-export-errors.component';
import { DashboardResolveMappingErrorDialogComponent } from './components/dashboard/dashboard-resolve-mapping-error-dialog/dashboard-resolve-mapping-error-dialog.component';
import { DashboardShimmersComponent } from './components/dashboard/dashboard-shimmers/dashboard-shimmers.component';
import { DashboardExportLogDialogComponent } from './components/dashboard/dashboard-export-log-dialog/dashboard-export-log-dialog.component';
import { DashboardQboErrorDialogComponent } from './components/dashboard/dashboard-qbo-error-dialog/dashboard-qbo-error-dialog.component';
import { ExportLogChildTableComponent } from './components/export-log/export-log-child-table/export-log-child-table.component';
import { PreviewDialogComponent } from './components/configuration/preview-dialog/preview-dialog.component';
import { ConfirmationDialogComponent } from './components/core/confirmation-dialog/confirmation-dialog.component';

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
    SimpleSearchSelectComponent,
    QboConnectorComponent,
    TrimCharacterPipe,
    SearchPipe,
    SnakeCaseToSpaceCase,
    ExpenseFieldCreationDialogComponent,
    ConfigurationStepFooterSectionComponent,
    ConfigurationSelectFieldComponent,
    ConfigurationToggleFieldComponent,
    OnboardingHeaderComponent,
    ZeroStateWithIllustrationComponent,
    SimpleSearchTextComponent,
    AdvancedSearchSelectComponent,
    PaginatorComponent,
    MappingHeaderSectionComponent,
    MappingStatsComponent,
    MappingFilterComponent,
    MappingTableComponent,
    MappingShimmersComponent,
    GenericMappingComponent,
    ExportLogHeaderSectionComponent,
    ExportLogDateFilterComponent,
    ExportLogTableComponent,
    DashboardHeaderSectionComponent,
    DashboardExportComponent,
    DashboardExportStatsComponent,
    DashboardExportErrorsComponent,
    DashboardResolveMappingErrorDialogComponent,
    DashboardShimmersComponent,
    DashboardExportLogDialogComponent,
    DashboardQboErrorDialogComponent,
    ExportLogChildTableComponent,
    PreviewDialogComponent,
    ConfirmationDialogComponent,
    ConfirmationDialogComponent
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
    MatProgressSpinnerModule
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
    SnakeCaseToSpaceCase,
    ConfigurationStepFooterSectionComponent,
    ConfigurationSelectFieldComponent,
    ConfigurationToggleFieldComponent,
    OnboardingHeaderComponent,
    OnboardingHeaderComponent,
    ZeroStateWithIllustrationComponent,
    SimpleSearchTextComponent,
    AdvancedSearchSelectComponent,
    PaginatorComponent,
    MappingHeaderSectionComponent,
    MappingStatsComponent,
    MappingFilterComponent,
    MappingTableComponent,
    MappingShimmersComponent,
    GenericMappingComponent,
    ExportLogHeaderSectionComponent,
    ExportLogDateFilterComponent,
    ExportLogTableComponent,
    DashboardHeaderSectionComponent,
    DashboardExportComponent,
    DashboardExportStatsComponent,
    DashboardExportErrorsComponent,
    DashboardResolveMappingErrorDialogComponent,
    DashboardShimmersComponent,
    ExportLogChildTableComponent
  ],
  entryComponents: [
    ExpenseFieldCreationDialogComponent,
    PreviewDialogComponent,
    ConfirmationDialogComponent
  ],
  providers: []
})
export class SharedModule { }
