import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { FyleCallbackComponent } from './fyle-callback/fyle-callback.component';
import { QboCallbackComponent } from './qbo-callback/qbo-callback.component';



@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    FyleCallbackComponent,
    QboCallbackComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AuthModule { }
