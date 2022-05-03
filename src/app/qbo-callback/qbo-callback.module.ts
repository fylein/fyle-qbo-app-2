import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboCallbackRoutingModule } from './qbo-callback-routing.module';
import { QboCallbackComponent } from './qbo-callback.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    QboCallbackComponent
  ],
  imports: [
    CommonModule,
    QboCallbackRoutingModule,
    SharedModule
  ]
})
export class QboCallbackModule { }
