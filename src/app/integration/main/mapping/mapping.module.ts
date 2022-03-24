import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MappingRoutingModule } from './mapping-routing.module';
import { MappingComponent } from './mapping.component';
import { EmployeeMappingComponent } from './employee-mapping/employee-mapping.component';


@NgModule({
  declarations: [
    MappingComponent,
    EmployeeMappingComponent
  ],
  imports: [
    CommonModule,
    MappingRoutingModule
  ]
})
export class MappingModule { }
