import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ZeroStateComponent } from './shared/components/zero-state/zero-state.component';
import { MandatoryFieldComponent } from './shared/components/mandatory-field/mandatory-field.component';
import { MandatoryErrorMessageComponent } from './shared/components/mandatory-error-message/mandatory-error-message.component';
import { OnboardingHeaderComponent } from './shared/components/onboarding-header/onboarding-header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { OnboardingStepperComponent } from './shared/components/onboarding-stepper/onboarding-stepper.component';
import { ExportSettingsComponent } from './shared/components/export-settings/export-settings.component';
import { ImportSettingsComponent } from './shared/components/import-settings/import-settings.component';
import { AdvancedSettingsComponent } from './shared/components/advanced-settings/advanced-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    ZeroStateComponent,
    MandatoryFieldComponent,
    MandatoryErrorMessageComponent,
    OnboardingHeaderComponent,
    FooterComponent,
    OnboardingStepperComponent,
    ExportSettingsComponent,
    ImportSettingsComponent,
    AdvancedSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
