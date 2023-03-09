import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { createCustomElement } from '@angular/elements';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FlexLayoutModule,
    SharedModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  exports: [DashboardComponent],
  bootstrap: [],
  entryComponents: [DashboardComponent]
})
export class DashboardModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(DashboardComponent, { injector });
    if (!customElements.get('qbo-dashboard')) {
      customElements.define('qbo-dashboard', el);
    }
  }

  ngDoBootstrap() {}
}
