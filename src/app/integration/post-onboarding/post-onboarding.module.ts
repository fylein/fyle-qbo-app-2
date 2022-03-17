import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { PostOnboardingRoutingModule } from './post-onboarding-routing.module';
import { PostOnboardingComponent } from './post-onboarding.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PostOnboardingComponent
  ],
  imports: [
    CommonModule,
    PostOnboardingRoutingModule,
    SharedModule,
    FlexLayoutModule
  ]
})
export class PostOnboardingModule { }
