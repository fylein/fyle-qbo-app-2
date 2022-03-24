import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationEmployeeSettingsComponent } from './configuration-employee-settings/configuration-employee-settings.component';
import { ConfigurationExportSettingsComponent } from './configuration-export-settings/configuration-export-settings.component';
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
