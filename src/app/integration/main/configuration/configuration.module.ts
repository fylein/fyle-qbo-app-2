import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfigurationEmployeeSettingsComponent } from './configuration-employee-settings/configuration-employee-settings.component';
import { ConfigurationExportSettingsComponent } from './configuration-export-settings/configuration-export-settings.component';
import { ConfigurationImportSettingsComponent } from './configuration-import-settings/configuration-import-settings.component';
import { ConfigurationAdvancedSettingsComponent } from './configuration-advanced-settings/configuration-advanced-settings.component';


@NgModule({
  declarations: [
    ConfigurationComponent,
    ConfigurationEmployeeSettingsComponent,
    ConfigurationExportSettingsComponent,
    ConfigurationImportSettingsComponent,
    ConfigurationAdvancedSettingsComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SharedModule,
    FlexLayoutModule
  ]
})
export class ConfigurationModule { }
