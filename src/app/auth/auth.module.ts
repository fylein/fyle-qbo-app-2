import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { FyleCallbackComponent } from './fyle-callback/fyle-callback.component';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedLoginComponent } from './shared-login/shared-login.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    FyleCallbackComponent,
    AuthComponent,
    SharedLoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ]
})
export class AuthModule { }
