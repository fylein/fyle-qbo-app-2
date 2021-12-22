import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboCallbackRoutingModule } from './qbo-callback-routing.module';
import { QboCallbackComponent } from './qbo-callback.component';


@NgModule({
  declarations: [
    QboCallbackComponent
  ],
  imports: [
    CommonModule,
    QboCallbackRoutingModule
  ]
})
export class QboCallbackModule { }
