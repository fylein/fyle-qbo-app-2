import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { EmailMultiSelectComponent } from './email-multi-select/email-multi-select.component';


@NgModule({
  declarations: [
    EmailMultiSelectComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ]
})
export class CoreModule { }
