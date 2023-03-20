import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { SharedModule } from 'src/app/shared/shared.module';

import { MappingRoutingModule } from './mapping-routing.module';
import { MappingComponent } from './mapping.component';
import { EmployeeMappingComponent } from './employee-mapping/employee-mapping.component';
import { CustomMappingComponent } from './custom-mapping/custom-mapping.component';


@NgModule({
  declarations: [
    MappingComponent,
    EmployeeMappingComponent,
    CustomMappingComponent
  ],
  imports: [
    CommonModule,
    MappingRoutingModule,
    FlexLayoutModule,
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ]
})
export class MappingModule { }
