import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationEmployeeSettingsComponent } from './configuration-employee-settings/configuration-employee-settings.component';
import { ConfigurationQboConnectorComponent } from './configuration-qbo-connector/configuration-qbo-connector.component';
import { ConfigurationComponent } from './configuration.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      {
        path: 'qbo_connector',
        component: ConfigurationQboConnectorComponent
      },
      {
        path: 'employee_settings',
        component: ConfigurationEmployeeSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
