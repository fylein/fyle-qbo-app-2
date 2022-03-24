import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExportLogRoutingModule } from './export-log-routing.module';
import { ExportLogComponent } from './export-log.component';
import { SharedModule } from 'src/app/shared/shared.module';




@NgModule({
  declarations: [
    ExportLogComponent
  ],
  imports: [
    CommonModule,
    ExportLogRoutingModule,
    SharedModule,
    FlexLayoutModule,
    MatTableModule,
    MatTooltipModule
  ]
})
export class ExportLogModule { }
