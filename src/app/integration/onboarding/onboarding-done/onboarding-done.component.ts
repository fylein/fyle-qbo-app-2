import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClickEvent } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/core/tracking.service';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss']
})
export class OnboardingDoneComponent implements OnInit {

  constructor(
    private router: Router,
    private trackingService: TrackingService
  ) { }

  navigateToDashboard(): void {
    this.trackingService.onClickEvent(ClickEvent.CONNECT_QBO);
    this.router.navigate([`/workspaces/main/dashboard`]);
  }

  ngOnInit(): void {
  }

}
