import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTableModule,
    MatTooltipModule
  ]
})
export class MappingModule { }
