import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QboConnectorComponent } from './components/qbo-connector/qbo-connector.component';
import { EmployeeSettingsComponent } from './components/employee-settings/employee-settings.component';



@NgModule({
  declarations: [
    QboConnectorComponent,
    EmployeeSettingsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
