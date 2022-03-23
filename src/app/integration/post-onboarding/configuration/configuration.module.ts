import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationQboConnectorComponent } from './configuration-qbo-connector/configuration-qbo-connector.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfigurationEmployeeSettingsComponent } from './configuration-employee-settings/configuration-employee-settings.component';


@NgModule({
  declarations: [
    ConfigurationComponent,
    ConfigurationQboConnectorComponent,
    ConfigurationEmployeeSettingsComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SharedModule,
    FlexLayoutModule
  ]
})
export class ConfigurationModule { }
