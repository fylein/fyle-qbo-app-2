import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatIconModule } from '@angular/material/icon';

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
    MatTabsModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class ExportLogModule { }
