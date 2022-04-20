import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExportLogRoutingModule } from './export-log-routing.module';
import { ExportLogComponent } from './export-log.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExportLogChildDialogComponent } from './export-log-child-dialog/export-log-child-dialog.component';




@NgModule({
  declarations: [
    ExportLogComponent,
    ExportLogChildDialogComponent
  ],
  imports: [
    CommonModule,
    ExportLogRoutingModule,
    SharedModule,
    FlexLayoutModule,
    MatTableModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ExportLogModule { }
