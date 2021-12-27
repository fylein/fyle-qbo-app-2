import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ZeroStateComponent } from './shared/components/zero-state/zero-state.component';
import { MandatoryFieldComponent } from './shared/components/mandatory-field/mandatory-field.component';
import { MandatoryErrorMessageComponent } from './shared/components/mandatory-error-message/mandatory-error-message.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ExportSettingsComponent } from './shared/components/export-settings/export-settings.component';
import { ImportSettingsComponent } from './shared/components/import-settings/import-settings.component';
import { AdvancedSettingsComponent } from './shared/components/advanced-settings/advanced-settings.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ZeroStateComponent,
    MandatoryFieldComponent,
    MandatoryErrorMessageComponent,
    FooterComponent,
    ExportSettingsComponent,
    ImportSettingsComponent,
    AdvancedSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule
  ],
  providers: [
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS,
    },
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
