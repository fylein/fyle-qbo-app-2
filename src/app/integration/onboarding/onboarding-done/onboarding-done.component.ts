import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClickEvent, OnboardingStep, ProgressPhase, RefinerSurveyType } from 'src/app/core/models/enum/enum.model';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss']
})
export class OnboardingDoneComponent implements OnInit {

  private readonly sessionStartTime = new Date();

  constructor(
    private refinerService: RefinerService,
    private router: Router,
    private trackingService: TrackingService
  ) { }

  private trackSessionTime(): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.trackingService.trackTimeSpent(OnboardingStep.ONBOARDING_DONE, {phase: ProgressPhase.ONBOARDING, durationInSeconds: Math.floor(differenceInMs / 1000), eventState: 'success'});
  }

  navigateToDashboard(): void {
    this.trackSessionTime();
    this.trackingService.onClickEvent(ClickEvent.CONNECT_QBO);
    this.refinerService.triggerSurvey(RefinerSurveyType.ONBOARDING_DONE);
    this.router.navigate([`/workspaces/main/dashboard`]);
  }

  ngOnInit(): void {
    this.refinerService.initialise(RefinerSurveyType.ONBOARDING_DONE);
  }

}
