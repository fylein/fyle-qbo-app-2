import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationAdvancedSettingsComponent } from './configuration-advanced-settings/configuration-advanced-settings.component';
import { ConfigurationEmployeeSettingsComponent } from './configuration-employee-settings/configuration-employee-settings.component';
import { ConfigurationExportSettingsComponent } from './configuration-export-settings/configuration-export-settings.component';
import { ConfigurationImportSettingsComponent } from './configuration-import-settings/configuration-import-settings.component';
import { ConfigurationComponent } from './configuration.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      {
        path: 'employee_settings',
        component: ConfigurationEmployeeSettingsComponent
      },
      {
        path: 'export_settings',
        component: ConfigurationExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: ConfigurationImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: ConfigurationAdvancedSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
