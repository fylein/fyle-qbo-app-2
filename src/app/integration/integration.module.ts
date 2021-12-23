import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationComponent } from './integration.component';
import { IntegrationRoutingModule } from './integration-routing.module';



@NgModule({
  declarations: [
    IntegrationComponent
  ],
  imports: [
    CommonModule,
    IntegrationRoutingModule
  ]
})
export class IntegrationModule { }
