import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationComponent } from './integration.component';
import { IntegrationRoutingModule } from './integration-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    IntegrationComponent
  ],
  imports: [
    CommonModule,
    IntegrationRoutingModule,
    SharedModule
  ]
})
export class IntegrationModule { }
